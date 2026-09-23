import React, { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp, Button, Dropdown, Form } from 'antd';
import type { MenuProps } from 'antd';
import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { APP_ROUTES, DEFAULT_COLORS } from '../../../../../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../../../../resources/applications/constants/sectionLayout';
import type { ProtectionPlan } from '../../../models';
import type { FormValues } from '../../create';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  ACCENT_TINT,
  CARD_LAYOUT,
  HEALTH_ACCENT,
  PHASE_ACCENT,
  POLICY_CHIP_LABEL,
} from '../../../constants/protectionPlans';
import RowTag from '../../../../../../components/display/table/RowTag';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import TimeRemaining from '../../../../../../components/display/time/TimeRemaining';
import { formatDateTime, toTimestamp } from '../../../../../../utils/shared/time';
import type { AppDispatch, RootState } from '../../../../../../store';
import { cancelPlanThunk, deletePlanThunk, reactivatePlanThunk } from '../../../store';
import { getCurrentUser } from '../../../../../auth/utils';
import { usePermission, ACTION_PERMISSIONS } from '../../../../../auth/hooks';
import { ActionConfirmModal } from '../../../../../../components/display/modal';
import ReactivatePlanModal from '../../shared/ReactivatePlanModal';
import DuplicatePlanPanel from '../../panels/DuplicatePlanPanel';
import EditPlanPanel from '../../panels/EditPlanPanel';
import {
  CANCELLABLE_PHASES,
  NON_EDITABLE_PHASES,
  REACTIVATABLE_PHASES,
  isReactivateExpired,
} from '../../../utils/phaseRules';
import { usePlanTaxonomyLists } from '../../../hooks/usePlanTaxonomies';

interface ProtectionPlanCardProps {
  plan: ProtectionPlan;
}

const CARD_LABELS = PPC.LABELS.CARD;
const EMPTY_VALUE = '';

const MICRO_LABEL_STYLE: React.CSSProperties = {
  fontSize: CARD_LAYOUT.MICRO_FONT_SIZE_PX,
  fontWeight: 700,
  letterSpacing: CARD_LAYOUT.MICRO_TRACKING,
  textTransform: 'uppercase',
  color: DEFAULT_COLORS.TEXT_MUTED,
  lineHeight: 1.2,
};

const TRUNCATE_STYLE: React.CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const DIVIDED_BLOCK_STYLE: React.CSSProperties = {
  marginTop: CARD_LAYOUT.BLOCK_GAP_PX,
  paddingTop: CARD_LAYOUT.DIVIDER_GAP_PX,
  borderTop: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
};

interface PlanWindow {
  range: string;
  percent: number;
  /** A permanent plan has no window to run down, so it never renders a rail. */
  showRail: boolean;
  remaining: React.ReactNode;
}

const buildWindow = (plan: ProtectionPlan): PlanWindow => {
  const timeRange = plan.timeMode === 'time_range' ? plan.timeRange : undefined;
  if (!timeRange?.startAt || !timeRange.endAt) {
    const permanent = plan.timeMode === 'permanent';
    // A permanent plan has no window, so the range slot stays empty rather than
    // repeating "Always on" both beside the label and under it.
    return {
      range: permanent ? EMPTY_VALUE : CARD_LABELS.NO_SCHEDULE,
      percent: 0,
      showRail: false,
      remaining: permanent ? CARD_LABELS.PERMANENT_RANGE : CARD_LABELS.NO_SCHEDULE,
    };
  }

  const start = toTimestamp(timeRange.startAt);
  const end = toTimestamp(timeRange.endAt);
  const elapsed = end > start ? ((Date.now() - start) / (end - start)) * 100 : 100;

  return {
    range: `${formatDateTime(timeRange.startAt, CARD_LABELS.WINDOW_TIME_FORMAT)}${
      CARD_LABELS.RANGE_SEPARATOR
    }${formatDateTime(timeRange.endAt, CARD_LABELS.WINDOW_TIME_FORMAT)}`,
    percent: Math.min(Math.max(elapsed, 0), 100),
    showRail: true,
    remaining:
      Date.now() < start ? (
        <TimeRemaining date={timeRange.startAt} prefix={PPC.LABELS.PHASE_INFO.STARTS_IN_PREFIX} />
      ) : (
        <TimeRemaining date={timeRange.endAt} prefix={PPC.LABELS.PHASE_INFO.ENDS_IN_PREFIX} />
      ),
  };
};

const buildScopeValue = (plan: ProtectionPlan): string =>
  plan.scope.type === 'namespaces'
    ? CARD_LABELS.NAMESPACES_COUNT(plan.scope.namespaces?.length ?? 0)
    : CARD_LABELS.APPLICATIONS_COUNT(plan.scope.applicationIds?.length ?? 0);

const buildTargets = (plan: ProtectionPlan): string[] =>
  (plan.scope.type === 'namespaces' ? plan.scope.namespaces : plan.scope.applicationIds) ?? [];

function StatCell(props: {
  label: string;
  value: React.ReactNode;
  accent?: string;
}): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span style={MICRO_LABEL_STYLE}>{props.label}</span>
      <span
        style={{
          ...TRUNCATE_STYLE,
          fontSize: CARD_LAYOUT.VALUE_FONT_SIZE_PX,
          fontWeight: 600,
          color: props.accent ?? DEFAULT_COLORS.TEXT_PRIMARY,
          lineHeight: 1.3,
        }}
      >
        {props.value}
      </span>
    </div>
  );
}

function BlockedRow(props: { label: string }): React.ReactElement {
  return (
    <li
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minWidth: 0,
        background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
        borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
        padding: '3px 9px 3px 5px',
      }}
    >
      <span
        aria-hidden
        style={{
          width: CARD_LAYOUT.AVATAR_CHIP_SIZE_PX,
          height: CARD_LAYOUT.AVATAR_CHIP_SIZE_PX,
          borderRadius: '50%',
          background: DEFAULT_COLORS.DANGER_TINT,
          color: DEFAULT_COLORS.DANGER,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          flexShrink: 0,
        }}
      >
        <CloseOutlined />
      </span>
      <span
        title={props.label}
        style={{
          ...TRUNCATE_STYLE,
          fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
          color: DEFAULT_COLORS.TEXT_SECONDARY,
          lineHeight: 1.4,
        }}
      >
        {props.label}
      </span>
    </li>
  );
}

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [duplicatePanelOpen, setDuplicatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [editForm] = Form.useForm<FormValues>();
  const editDisabled = NON_EDITABLE_PHASES.includes(plan.phase);
  const canReactivate = REACTIVATABLE_PHASES.includes(plan.phase);
  const reactivateExpired = isReactivateExpired(plan);

  const canEditPlan = usePermission(
    ACTION_PERMISSIONS.protectionPlans.edit.scope,
    ACTION_PERMISSIONS.protectionPlans.edit.level,
    ACTION_PERMISSIONS.protectionPlans.edit.deny,
  );
  const canDuplicatePlan = usePermission(
    ACTION_PERMISSIONS.protectionPlans.duplicate.scope,
    ACTION_PERMISSIONS.protectionPlans.duplicate.level,
    ACTION_PERMISSIONS.protectionPlans.duplicate.deny,
  );
  const canReactivatePlan = usePermission(
    ACTION_PERMISSIONS.protectionPlans.reactivate.scope,
    ACTION_PERMISSIONS.protectionPlans.reactivate.level,
    ACTION_PERMISSIONS.protectionPlans.reactivate.deny,
  );
  const canCancelPlan = usePermission(
    ACTION_PERMISSIONS.protectionPlans.cancel.scope,
    ACTION_PERMISSIONS.protectionPlans.cancel.level,
    ACTION_PERMISSIONS.protectionPlans.cancel.deny,
  );
  const canDeletePlan = usePermission(
    ACTION_PERMISSIONS.protectionPlans.delete.scope,
    ACTION_PERMISSIONS.protectionPlans.delete.level,
    ACTION_PERMISSIONS.protectionPlans.delete.deny,
  );

  const detailsPath = APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(
    ':name',
    encodeURIComponent(plan.name),
  );

  const users = useSelector((state: RootState) => state.users.users);
  const createdByLabel = users.find((u) => u.id === plan.createdBy)?.username ?? plan.createdBy;

  const phaseLabel = PPC.LABELS.PHASE_LABELS[plan.phase] ?? plan.phase;
  const canCancel = CANCELLABLE_PHASES.includes(plan.phase);

  const phaseAccent = PHASE_ACCENT[plan.phase] ?? DEFAULT_COLORS.DEFAULT;
  const phaseTint = ACCENT_TINT[phaseAccent] ?? DEFAULT_COLORS.DEFAULT_TINT;
  const health = plan.health ?? 'unknown';
  // Health only speaks while the plan is running; a canceled plan's last known
  // health would otherwise light the card up green.
  const healthAccent =
    plan.phase === 'active' && plan.health ? HEALTH_ACCENT[health] : DEFAULT_COLORS.TEXT_PRIMARY;

  const isPermanent = plan.timeMode === 'permanent';
  const planWindow = buildWindow(plan);
  const targets = buildTargets(plan);
  const shownTargets = targets.slice(0, CARD_LAYOUT.MAX_TARGET_TAGS);
  const hiddenTargets = targets.length - shownTargets.length;
  const { environments, tags } = usePlanTaxonomyLists();
  const environmentName = environments.find((c) => c.id === plan.environmentID)?.name;
  const planTags = (plan.tagIDs ?? [])
    .map((id) => ({ id, name: tags.find((c) => c.id === id)?.name }))
    .filter((t): t is { id: string; name: string } => Boolean(t.name));
  const shownTags = planTags.slice(0, CARD_LAYOUT.MAX_TARGET_TAGS);
  const hiddenTagNames = planTags.length - shownTags.length;
  const policyLabels = (plan.policies ?? []).map(
    (policy) => POLICY_CHIP_LABEL[policy.templateID] ?? policy.templateID,
  );
  const shownPolicies = policyLabels.slice(0, CARD_LAYOUT.MAX_POLICY_CHIPS);
  const hiddenPolicies = policyLabels.length - shownPolicies.length;

  const menuButtonStyle: React.CSSProperties = {
    color: menuOpen ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.ICON_SECONDARY,
    flexShrink: 0,
    width: 30,
    height: 30,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CARD_LAYOUT.ICON_CHIP_RADIUS_PX,
    background: menuOpen ? DEFAULT_COLORS.BACKGROUND_HOVER : 'transparent',
    transition: 'background 120ms ease, color 120ms ease',
  };

  const handleCancel = useCallback(async () => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setCancelling(true);
    try {
      await dispatch(cancelPlanThunk({ userId, planId: plan.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.CANCEL_SUCCESS(plan.name));
      setCancelModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.CANCEL_ERROR);
    } finally {
      setCancelling(false);
    }
  }, [dispatch, message, plan.id, plan.name]);

  const handleReactivate = useCallback(async () => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setReactivating(true);
    try {
      await dispatch(reactivatePlanThunk({ userId, planId: plan.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.REACTIVATE_SUCCESS(plan.name));
      setReactivateModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.REACTIVATE_ERROR);
    } finally {
      setReactivating(false);
    }
  }, [dispatch, message, plan.id, plan.name]);

  const handleDelete = useCallback(async () => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setDeleting(true);
    try {
      await dispatch(deletePlanThunk({ userId, planId: plan.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.DELETE_SUCCESS(plan.name));
      setDeleteModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.DELETE_ERROR);
    } finally {
      setDeleting(false);
    }
  }, [dispatch, message, plan.id, plan.name]);

  const handleDuplicate = useCallback(() => {
    setDuplicatePanelOpen(true);
  }, []);

  const handleEdit = useCallback(() => {
    setEditPanelOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditPanelOpen(false);
    editForm.resetFields();
  }, [editForm]);

  const navigationBlocked =
    duplicatePanelOpen ||
    deleteModalOpen ||
    cancelModalOpen ||
    reactivateModalOpen ||
    editPanelOpen;

  const menuItems: NonNullable<MenuProps['items']> = [
    ...(canEditPlan
      ? [
          {
            key: 'edit',
            label: PPC.LABELS.DETAIL_PAGE.ACTIONS.EDIT,
            icon: <EditOutlined />,
            disabled: editDisabled || editPanelOpen,
          },
        ]
      : []),
    ...(canDuplicatePlan
      ? [
          {
            key: 'duplicate',
            label: PPC.LABELS.ACTIONS.DUPLICATE,
            icon: <CopyOutlined />,
            disabled: duplicatePanelOpen,
          },
        ]
      : []),
    ...(canReactivatePlan && canReactivate
      ? [
          {
            key: 'reactivate',
            label: PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE,
            icon: <PlayCircleOutlined />,
            disabled: reactivating || reactivateExpired,
          },
        ]
      : []),
    ...(canCancelPlan && canCancel
      ? [
          {
            key: 'cancel',
            label: PPC.LABELS.ACTIONS.CANCEL,
            icon: <StopOutlined />,
            danger: true,
            disabled: cancelling,
          },
        ]
      : []),
  ];
  if (canDeletePlan) {
    if (menuItems.length > 0) menuItems.push({ type: 'divider' });
    menuItems.push({
      key: 'delete',
      label: PPC.LABELS.ACTIONS.DELETE,
      icon: <DeleteOutlined />,
      danger: true,
      disabled: deleting,
    });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (navigationBlocked) return;
        navigate(detailsPath);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (navigationBlocked) return;
          e.preventDefault();
          navigate(detailsPath);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered
          ? DEFAULT_COLORS.SURFACE_ELEVATED_HOVER
          : DEFAULT_COLORS.SURFACE_ELEVATED,
        borderRadius: APPLICATION_SECTION_LAYOUT.CARD_RADIUS,
        border: `1px solid ${hovered ? DEFAULT_COLORS.BORDER_HOVER : DEFAULT_COLORS.BORDER_ELEVATED}`,
        padding: CARD_LAYOUT.PADDING_PX,
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition: 'background 140ms ease, border-color 140ms ease',
      }}
    >
      {/* Header: identity on the left, phase pill and actions on the right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 }}>
          <span
            aria-hidden
            style={{
              width: CARD_LAYOUT.ICON_CHIP_SIZE_PX,
              height: CARD_LAYOUT.ICON_CHIP_SIZE_PX,
              borderRadius: CARD_LAYOUT.ICON_CHIP_RADIUS_PX,
              background: phaseTint,
              color: phaseAccent,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            <SafetyCertificateOutlined />
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
            <span
              title={plan.name}
              style={{
                ...TRUNCATE_STYLE,
                fontSize: CARD_LAYOUT.TITLE_FONT_SIZE_PX,
                fontWeight: 600,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
                lineHeight: 1.3,
              }}
            >
              {plan.name}
            </span>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minWidth: 0 }}>
              {shownTargets.map((target) => (
                <RowTag
                  key={target}
                  text={target}
                  capitalize={false}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.TEXT_SECONDARY}
                  fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                />
              ))}
              {hiddenTargets > 0 && (
                <RowTag
                  text={CARD_LABELS.MORE_BLOCKED(hiddenTargets)}
                  capitalize={false}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.TEXT_MUTED}
                  fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                />
              )}
            </span>
            {(environmentName || planTags.length > 0) && (
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minWidth: 0 }}>
                {environmentName && (
                  <RowTag
                    text={environmentName}
                    capitalize={false}
                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                    color={DEFAULT_COLORS.TEXT_SECONDARY}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                  />
                )}
                {shownTags.map(({ id, name }) => (
                  <RowTag
                    key={id}
                    text={name}
                    capitalize={false}
                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                    color={DEFAULT_COLORS.TEXT_MUTED}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                  />
                ))}
                {hiddenTagNames > 0 && (
                  <RowTag
                    text={CARD_LABELS.MORE_BLOCKED(hiddenTagNames)}
                    capitalize={false}
                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                    color={DEFAULT_COLORS.TEXT_MUTED}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                  />
                )}
              </span>
            )}
          </span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
              background: phaseTint,
              color: phaseAccent,
              padding: '3px 10px',
              fontSize: CARD_LAYOUT.MICRO_FONT_SIZE_PX,
              fontWeight: 700,
              letterSpacing: CARD_LAYOUT.MICRO_TRACKING,
              textTransform: 'uppercase',
              lineHeight: 1.6,
            }}
          >
            <span
              aria-hidden
              style={{
                width: CARD_LAYOUT.DOT_SIZE_PX,
                height: CARD_LAYOUT.DOT_SIZE_PX,
                borderRadius: '50%',
                background: phaseAccent,
              }}
            />
            {phaseLabel}
          </span>
          {menuItems.length > 0 && (
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              open={menuOpen}
              onOpenChange={setMenuOpen}
              menu={{
                items: menuItems,
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  if (key === 'edit') handleEdit();
                  if (key === 'cancel') setCancelModalOpen(true);
                  if (key === 'delete') setDeleteModalOpen(true);
                  if (key === 'duplicate') handleDuplicate();
                  if (key === 'reactivate') setReactivateModalOpen(true);
                },
              }}
            >
              <Button
                type="text"
                shape="circle"
                icon={<MoreOutlined rotate={90} />}
                size="small"
                onClick={(e) => e.stopPropagation()}
                style={menuButtonStyle}
              />
            </Dropdown>
          )}
        </div>
      </div>

      {/* Window: label and range, then the rail running the window down */}
      <div style={{ marginTop: CARD_LAYOUT.BLOCK_GAP_PX }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span style={MICRO_LABEL_STYLE}>
            {isPermanent ? CARD_LABELS.PERMANENT_LABEL : CARD_LABELS.WINDOW_LABEL}
          </span>
          <span
            style={{
              ...TRUNCATE_STYLE,
              fontSize: CARD_LAYOUT.MONO_FONT_SIZE_PX,
              fontVariantNumeric: 'tabular-nums',
              color: DEFAULT_COLORS.TEXT_MUTED,
            }}
          >
            {planWindow.range}
          </span>
        </div>
        {planWindow.showRail && (
          <div
            aria-hidden
            style={{
              marginTop: 8,
              height: CARD_LAYOUT.TRACK_HEIGHT_PX,
              borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
              background: DEFAULT_COLORS.BACKGROUND_HOVER,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${planWindow.percent}%`,
                borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
                background: phaseAccent,
                transition: 'width 200ms ease',
              }}
            />
          </div>
        )}
        <p
          style={{
            margin: '8px 0 0',
            fontSize: CARD_LAYOUT.VALUE_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            lineHeight: 1.3,
          }}
        >
          {planWindow.remaining}
        </p>
      </div>

      {/* Stats: the four answers a plan is scanned for */}
      <div
        style={{
          ...DIVIDED_BLOCK_STYLE,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          columnGap: CARD_LAYOUT.CHIPS_GAP_PX,
        }}
      >
        <StatCell label={CARD_LABELS.STATS.SCOPE} value={buildScopeValue(plan)} />
        <StatCell label={CARD_LABELS.STATS.MODE} value={PPC.LABELS.MODE_LABELS[plan.mode]} />
        <StatCell
          label={CARD_LABELS.STATS.TEMPLATES}
          value={CARD_LABELS.TEMPLATES_COUNT(policyLabels.length)}
        />
        <StatCell
          label={CARD_LABELS.STATS.HEALTH}
          value={PPC.LABELS.HEALTH_LABELS[health]}
          accent={healthAccent}
        />
      </div>

      {/* What the plan refuses, in the operator's words rather than template ids */}
      <div style={DIVIDED_BLOCK_STYLE}>
        <span style={MICRO_LABEL_STYLE}>
          {isPermanent ? CARD_LABELS.BLOCKED_LABEL_PERMANENT : CARD_LABELS.BLOCKED_LABEL}
        </span>
        {shownPolicies.length === 0 ? (
          <p
            style={{
              margin: '10px 0 0',
              fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
              color: DEFAULT_COLORS.TEXT_MUTED,
            }}
          >
            {CARD_LABELS.REFUSES_NONE}
          </p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              margin: '8px 0 0',
              padding: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            {shownPolicies.map((label) => (
              <BlockedRow key={label} label={label} />
            ))}
            {hiddenPolicies > 0 && (
              <li style={{ ...MICRO_LABEL_STYLE, alignSelf: 'center' }}>
                {CARD_LABELS.MORE_BLOCKED(hiddenPolicies)}
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Provenance: who put this window in place and when it last moved */}
      <div
        style={{
          ...DIVIDED_BLOCK_STYLE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
          color: DEFAULT_COLORS.TEXT_MUTED,
        }}
      >
        <span style={TRUNCATE_STYLE}>{`${CARD_LABELS.CREATED_BY_PREFIX} ${createdByLabel}`}</span>
        <span style={{ flexShrink: 0 }}>
          {CARD_LABELS.UPDATED_PREFIX} <TimeAgo date={plan.lastUpdatedAt || plan.createdAt} />
        </span>
      </div>

      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <ActionConfirmModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title={PPC.LABELS.ACTIONS.DELETE_MODAL_TITLE}
          action="delete"
          resourceName={plan.name}
          resourceType="protection plan"
          confirmText={PPC.LABELS.ACTIONS.DELETE_MODAL_OK}
          loading={deleting}
          getContainer={() => document.body}
        />
        <ActionConfirmModal
          open={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleCancel}
          title={PPC.LABELS.DETAIL_PAGE.ACTIONS.CANCEL_MODAL_TITLE}
          action="cancel"
          resourceName={plan.name}
          resourceType="protection plan"
          confirmText={PPC.LABELS.DETAIL_PAGE.ACTIONS.CANCEL_MODAL_OK}
          loading={cancelling}
          getContainer={() => document.body}
        />
        <ReactivatePlanModal
          open={reactivateModalOpen}
          planName={plan.name}
          loading={reactivating}
          onClose={() => setReactivateModalOpen(false)}
          onConfirm={handleReactivate}
        />
      </div>
      <DuplicatePlanPanel
        key={`duplicate-${plan.id}`}
        open={duplicatePanelOpen}
        onClose={() => setDuplicatePanelOpen(false)}
        plan={plan}
      />
      {editPanelOpen && (
        <EditPlanPanel
          key={`edit-${plan.id}`}
          open={editPanelOpen}
          onClose={handleCloseEdit}
          plan={plan}
          form={editForm}
        />
      )}
    </div>
  );
});

ProtectionPlanCard.displayName = 'ProtectionPlanCard';

export default ProtectionPlanCard;
