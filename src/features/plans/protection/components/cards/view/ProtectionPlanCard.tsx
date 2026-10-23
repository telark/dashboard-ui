import React, { memo, useCallback, useMemo, useState } from 'react';
import { App as AntdApp, Button, Dropdown, Form, Tag, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  APP_ROUTES,
  CARD_ASIDE_STYLE,
  CARD_HEADER_STYLE,
  CARD_IDENTITY_STYLE,
  CARD_LAYOUT,
  CARD_TAG_ROW_STYLE,
  CARD_TEXTS,
  CARD_TITLE_COLUMN_STYLE,
  CARD_TITLE_STYLE,
  DEFAULT_COLORS,
  EMPTY_VALUE,
  STATUS_COLORS,
  TRUNCATE_STYLE,
  getCardMenuButtonStyle,
  getCardShellStyle,
  getPillColor,
  SPACING,
  MOTION,
} from '../../../../../../constants';
import type { PlanApprovalDecision, PlanTimeRange, ProtectionPlan } from '../../../models';
import type { FormValues } from '../../create';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PLAN_CARD_MAX_TAGS,
  PLAN_LOUD_HEALTH,
  POLICY_CHIP_LABEL,
} from '../../../constants/protectionPlans';
import { CardChipSection, CardTagList } from '../../../../../../components/display/card';
import { HealthIndicator } from '../../../../../../components/display/details';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import TimeRemaining from '../../../../../../components/display/time/TimeRemaining';
import { toTimestamp } from '../../../../../../utils/shared/time';
import type { AppDispatch } from '../../../../../../store';
import {
  cancelPlanThunk,
  decidePlanThunk,
  deletePlanThunk,
  reactivatePlanThunk,
} from '../../../store';
import { getCurrentUser } from '../../../../../auth/utils';
import { usePermission, ACTION_PERMISSIONS } from '../../../../../auth/hooks';
import { ActionConfirmModal } from '../../../../../../components/display/modal';
import ReactivatePlanModal from '../../shared/ReactivatePlanModal';
import DeletePlanModal from '../../shared/DeletePlanModal';
import ApprovalDecisionModal from '../../shared/ApprovalDecisionModal';
import DuplicatePlanPanel from '../../panels/DuplicatePlanPanel';
import EditPlanPanel from '../../panels/EditPlanPanel';
import {
  APPROVABLE_PHASES,
  CANCELLABLE_PHASES,
  REACTIVATABLE_PHASES,
  getDecideBlockedTooltip,
  getGenerateReportTooltip,
  isReactivateExpired,
  isReportNotStarted,
  liveWindow,
  permissionTooltip,
  planPhaseLabel,
} from '../../../utils/phaseRules';
import { formatRepeatRule } from '../../../utils/repeatRule';
import { formatWindowRange } from '../../../utils/windowRange';
import { usePlanTaxonomyLists } from '../../../hooks/usePlanTaxonomies';
import { useGeneratePlanReport } from '../../../hooks/usePlanReports';

interface ProtectionPlanCardProps {
  plan: ProtectionPlan;
  // Passed in rather than read from useNavigate: that hook re-renders on every URL
  // change, which re-rendered every card when the page's tab query changed.
  onOpen: (path: string) => void;
  /** Actor id → name, from useUsernamesByIds. */
  names: Record<string, string>;
}

const CARD_LABELS = PPC.LABELS.CARD;

const MUTED_LINE_STYLE: React.CSSProperties = {
  fontSize: CARD_LAYOUT.VALUE_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

const DESCRIPTION_STYLE: React.CSSProperties = {
  ...TRUNCATE_STYLE,
  fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

// The row's height is reserved while the tag names load.
const TAG_ROW_STYLE: React.CSSProperties = {
  ...CARD_TAG_ROW_STYLE,
  minHeight: CARD_LAYOUT.TAG_ROW_MIN_HEIGHT_PX,
};

// Centered on the name line and no taller than it, so the description follows the name closely.
const CORNER_STYLE: React.CSSProperties = {
  ...CARD_ASIDE_STYLE,
  marginTop: CARD_LAYOUT.CORNER_OFFSET_PX,
  marginBottom: CARD_LAYOUT.CORNER_OFFSET_PX,
};

// The countdown wraps under the range on a narrow card rather than cutting it.
const WINDOW_LINE_STYLE: React.CSSProperties = {
  ...MUTED_LINE_STYLE,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  columnGap: SPACING.SM,
  rowGap: SPACING.XXS,
  minWidth: 0,
};

const WINDOW_LABEL_STYLE: React.CSSProperties = { flexShrink: 0 };

const WINDOW_VALUE_STYLE: React.CSSProperties = {
  ...TRUNCATE_STYLE,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  fontVariantNumeric: 'tabular-nums',
};

const REMAINING_STYLE: React.CSSProperties = {
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
};

// Neutral, like the usage meters: the rail measures time, it is not a status.
const RAIL_TRACK_STYLE: React.CSSProperties = {
  marginTop: SPACING.SM,
  height: CARD_LAYOUT.TRACK_HEIGHT_PX,
  borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
  background: DEFAULT_COLORS.HOVER_BG,
  overflow: 'hidden',
};

const RAIL_FILL_STYLE: React.CSSProperties = {
  height: '100%',
  borderRadius: CARD_LAYOUT.PILL_RADIUS_PX,
  background: DEFAULT_COLORS.NEUTRAL,
  transition: `width ${MOTION.BASE_MS}ms ${MOTION.EASE}`,
};

const BOTTOM_STYLE: React.CSSProperties = {
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: SPACING.XS,
};

const META_LINE_STYLE: React.CSSProperties = { ...MUTED_LINE_STYLE, minWidth: 0 };

const FOOTER_STYLE: React.CSSProperties = {
  ...TRUNCATE_STYLE,
  fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

interface PlanWindow {
  label: string;
  value: string;
  percent: number;
  /** A permanent plan has no window to run down, so it never renders a rail. */
  showRail: boolean;
  /** The countdown beside a set window. */
  remaining?: React.ReactNode;
}

// A permanent plan, a stopped series (shown by its rule) or a range never set: nothing to run down.
const staticWindow = (plan: ProtectionPlan): PlanWindow => {
  const permanent = plan.timeMode === 'permanent';
  const rule =
    plan.timeMode === 'repeating' && plan.repeat ? formatRepeatRule(plan.repeat) : undefined;
  return {
    label: permanent ? CARD_LABELS.PERMANENT_LABEL : CARD_LABELS.WINDOW_LABEL,
    value: rule ?? (permanent ? CARD_LABELS.PERMANENT_RANGE : CARD_LABELS.NO_SCHEDULE),
    percent: 0,
    showRail: false,
  };
};

const windowLabel = (plan: ProtectionPlan): string => {
  if (plan.timeMode !== 'repeating') return CARD_LABELS.WINDOW_LABEL;
  return plan.phase === 'active' ? CARD_LABELS.CURRENT_WINDOW_LABEL : CARD_LABELS.NEXT_WINDOW_LABEL;
};

const countdown = ({ startAt, endAt }: PlanTimeRange): React.ReactNode =>
  Date.now() < toTimestamp(startAt) ? (
    <TimeRemaining
      date={startAt}
      prefix={PPC.LABELS.PHASE_INFO.STARTS_IN_PREFIX}
      endedPrefix={PPC.LABELS.PHASE_INFO.STARTED_PREFIX}
    />
  ) : (
    <TimeRemaining date={endAt} prefix={PPC.LABELS.PHASE_INFO.ENDS_IN_PREFIX} />
  );

const buildWindow = (plan: ProtectionPlan): PlanWindow => {
  const timeRange = plan.timeMode === 'time_range' ? plan.timeRange : liveWindow(plan);
  if (!timeRange?.startAt || !timeRange.endAt) return staticWindow(plan);
  const start = toTimestamp(timeRange.startAt);
  const end = toTimestamp(timeRange.endAt);
  const elapsed = end > start ? ((Date.now() - start) / (end - start)) * 100 : 100;
  const awaitingApproval = plan.timeMode === 'repeating' && plan.phase === 'pending_approval';

  return {
    label: windowLabel(plan),
    value: formatWindowRange(timeRange),
    percent: Math.min(Math.max(elapsed, 0), 100),
    showRail: !awaitingApproval,
    remaining: awaitingApproval ? CARD_LABELS.OPENS_ONCE_APPROVED : countdown(timeRange),
  };
};

const buildScopeValue = (plan: ProtectionPlan): string =>
  plan.scope.type === 'namespaces'
    ? CARD_LABELS.NAMESPACES_COUNT(plan.scope.namespaces?.length ?? 0)
    : CARD_LABELS.APPLICATIONS_COUNT(plan.scope.applicationRefs?.length ?? 0);

const buildTargets = (plan: ProtectionPlan): string[] =>
  (plan.scope.type === 'namespaces' ? plan.scope.namespaces : plan.scope.applicationRefs) ?? [];

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan, onOpen, names }) => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [duplicatePanelOpen, setDuplicatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [decisionModal, setDecisionModal] = useState<PlanApprovalDecision | null>(null);
  // Kept after close so the fading modal does not flip between approve and reject copy.
  const [lastDecision, setLastDecision] = useState<PlanApprovalDecision>('approved');
  const [deciding, setDeciding] = useState(false);
  const [editForm] = Form.useForm<FormValues>();
  const canReactivate = REACTIVATABLE_PHASES.includes(plan.phase);
  const reactivateExpired = isReactivateExpired(plan);
  const canDecide = APPROVABLE_PHASES.includes(plan.phase);
  const decideBlockedTooltip = getDecideBlockedTooltip(plan, getCurrentUser()?.id ?? '');
  const decideDisabled = deciding || decideBlockedTooltip !== undefined;

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
  const canApprovePlan = usePermission(
    ACTION_PERMISSIONS.protectionPlans.approve.scope,
    ACTION_PERMISSIONS.protectionPlans.approve.level,
    ACTION_PERMISSIONS.protectionPlans.approve.deny,
  );
  const canRejectPlan = usePermission(
    ACTION_PERMISSIONS.protectionPlans.reject.scope,
    ACTION_PERMISSIONS.protectionPlans.reject.level,
    ACTION_PERMISSIONS.protectionPlans.reject.deny,
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
  const canGenerateReport = usePermission(
    ACTION_PERMISSIONS.protectionPlans.generateReport.scope,
    ACTION_PERMISSIONS.protectionPlans.generateReport.level,
    ACTION_PERMISSIONS.protectionPlans.generateReport.deny,
  );
  const { generating: generatingReport, generate: generateReport } = useGeneratePlanReport(plan.id);

  const detailsPath = APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(
    ':name',
    encodeURIComponent(plan.name),
  );

  const requesterId = plan.approval?.requestedBy;
  const awaitingApproval = plan.phase === 'pending_approval' && Boolean(requesterId);
  const provenanceActor = awaitingApproval ? requesterId : plan.createdBy;
  const provenanceName = provenanceActor ? names[provenanceActor] : EMPTY_VALUE;
  const provenancePrefix = awaitingApproval
    ? CARD_LABELS.AWAITING_APPROVAL_BY_PREFIX
    : CARD_LABELS.CREATED_BY_PREFIX;
  const updatedAt = plan.lastUpdatedAt || plan.createdAt;
  const exactTimes = useMemo(
    () => [
      { label: CARD_TEXTS.UPDATED_PREFIX, date: updatedAt },
      { label: CARD_TEXTS.CREATED_PREFIX, date: plan.createdAt },
    ],
    [updatedAt, plan.createdAt],
  );

  const phaseLabel = planPhaseLabel(plan);
  const canCancel = CANCELLABLE_PHASES.includes(plan.phase);

  const phaseAccent = STATUS_COLORS.PLAN_PHASE[plan.phase] ?? DEFAULT_COLORS.NEUTRAL;
  const health = plan.health ?? 'unknown';
  // Health only shows while the plan is running; a canceled plan's last known
  // health would otherwise light the card up green.
  const running = plan.phase === 'active';

  const isPermanent = plan.timeMode === 'permanent';
  const planWindow = buildWindow(plan);
  const targets = buildTargets(plan);
  const scopeValue = buildScopeValue(plan);
  const { kinds, environments, tags } = usePlanTaxonomyLists();
  // The environment first, then the kind and the tags.
  const classification = [
    environments.find((c) => c.id === plan.environmentRef)?.name,
    kinds.find((c) => c.id === plan.kindRef)?.name,
    ...(plan.tagRefs ?? []).map((id) => tags.find((c) => c.id === id)?.name),
  ].filter((name): name is string => Boolean(name));
  const description = plan.description?.trim();
  const policyLabels = (plan.policies ?? []).map(
    (policy) => POLICY_CHIP_LABEL[policy.templateID] ?? policy.templateID,
  );

  const menuButtonStyle = getCardMenuButtonStyle(menuOpen);

  const handleCancel = useCallback(async () => {
    setCanceling(true);
    try {
      await dispatch(cancelPlanThunk({ planId: plan.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.CANCEL_SUCCESS(plan.name));
      setCancelModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.CANCEL_ERROR);
    } finally {
      setCanceling(false);
    }
  }, [dispatch, message, plan.id, plan.name]);

  const handleReactivate = useCallback(async () => {
    setReactivating(true);
    try {
      await dispatch(reactivatePlanThunk({ planId: plan.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.REACTIVATE_SUCCESS(plan.name));
      setReactivateModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.REACTIVATE_ERROR);
    } finally {
      setReactivating(false);
    }
  }, [dispatch, message, plan.id, plan.name]);

  const openDecision = useCallback((decision: PlanApprovalDecision) => {
    setLastDecision(decision);
    setDecisionModal(decision);
  }, []);

  const requestedAt = plan.approval?.requestedAt ?? '';
  const handleDecide = useCallback(
    async (comment: string) => {
      if (!decisionModal) return;
      const approved = decisionModal === 'approved';
      setDeciding(true);
      try {
        await dispatch(
          decidePlanThunk({
            planId: plan.id,
            decision: decisionModal,
            comment: comment || undefined,
            requestedAt,
          }),
        ).unwrap();
        message.success(
          approved
            ? PPC.LABELS.ACTIONS.APPROVE_SUCCESS(plan.name)
            : PPC.LABELS.ACTIONS.REJECT_SUCCESS(plan.name),
        );
        setDecisionModal(null);
      } catch (err: unknown) {
        const fallback = approved
          ? PPC.LABELS.ACTIONS.APPROVE_ERROR
          : PPC.LABELS.ACTIONS.REJECT_ERROR;
        message.error(typeof err === 'string' && err ? err : fallback);
      } finally {
        setDeciding(false);
      }
    },
    [decisionModal, dispatch, message, requestedAt, plan.id, plan.name],
  );

  const handleDelete = useCallback(
    async (keepReports: boolean) => {
      setDeleting(true);
      try {
        await dispatch(deletePlanThunk({ planId: plan.id, keepReports })).unwrap();
        message.success(PPC.LABELS.ACTIONS.DELETE_SUCCESS(plan.name));
        setDeleteModalOpen(false);
      } catch (err: unknown) {
        message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.DELETE_ERROR);
      } finally {
        setDeleting(false);
      }
    },
    [dispatch, message, plan.id, plan.name],
  );

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
    decisionModal !== null ||
    editPanelOpen;

  const PD = PPC.LABELS.PERMISSION_DENIED;
  const menuItems: NonNullable<MenuProps['items']> = [
    ...(canDecide
      ? [
          {
            key: 'approve',
            label: PPC.LABELS.DETAIL_PAGE.ACTIONS.APPROVE,
            icon: <CheckCircleOutlined />,
            disabled: !canApprovePlan || decideDisabled,
            title: permissionTooltip(canApprovePlan, PD.APPROVE, decideBlockedTooltip),
          },
          {
            key: 'reject',
            label: PPC.LABELS.DETAIL_PAGE.ACTIONS.REJECT,
            icon: <CloseCircleOutlined />,
            danger: true,
            disabled: !canRejectPlan || decideDisabled,
            title: permissionTooltip(canRejectPlan, PD.REJECT, decideBlockedTooltip),
          },
        ]
      : []),
    {
      key: 'edit',
      label: PPC.LABELS.DETAIL_PAGE.ACTIONS.EDIT,
      icon: <EditOutlined />,
      disabled: !canEditPlan || editPanelOpen,
      title: permissionTooltip(canEditPlan, PD.EDIT),
    },
    {
      key: 'duplicate',
      label: PPC.LABELS.ACTIONS.DUPLICATE,
      icon: <CopyOutlined />,
      disabled: !canDuplicatePlan || duplicatePanelOpen,
      title: permissionTooltip(canDuplicatePlan, PD.DUPLICATE),
    },
    {
      key: 'generateReport',
      label: PPC.LABELS.REPORTS.GENERATE,
      icon: <FileTextOutlined />,
      disabled: !canGenerateReport || generatingReport || isReportNotStarted(plan),
      title: getGenerateReportTooltip(plan, canGenerateReport),
    },
    ...(canReactivate
      ? [
          {
            key: 'reactivate',
            label: PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE,
            icon: <PlayCircleOutlined />,
            disabled: !canReactivatePlan || reactivating || reactivateExpired,
            title: permissionTooltip(
              canReactivatePlan,
              PD.REACTIVATE,
              reactivateExpired
                ? PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_DISABLED_EXPIRED_TOOLTIP
                : undefined,
            ),
          },
        ]
      : []),
    // Cancel and delete end a plan: both sit in the danger zone, as on the details page.
    { type: 'divider' },
    ...(canCancel
      ? [
          {
            key: 'cancel',
            label: PPC.LABELS.ACTIONS.CANCEL,
            icon: <StopOutlined />,
            danger: true,
            disabled: !canCancelPlan || canceling,
            title: permissionTooltip(canCancelPlan, PD.CANCEL),
          },
        ]
      : []),
    {
      key: 'delete',
      label: PPC.LABELS.ACTIONS.DELETE,
      icon: <DeleteOutlined />,
      danger: true,
      disabled: !canDeletePlan || deleting,
      title: permissionTooltip(canDeletePlan, PD.DELETE),
    },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (navigationBlocked) return;
        onOpen(detailsPath);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (navigationBlocked) return;
          e.preventDefault();
          onOpen(detailsPath);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...getCardShellStyle(hovered),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: CARD_LAYOUT.BLOCK_GAP_PX,
      }}
    >
      {/* Header: the name beside phase, health and actions, then the description and tags under
          both, so the corner never squeezes them into a stack. */}
      <div style={CARD_TITLE_COLUMN_STYLE}>
        <div style={CARD_HEADER_STYLE}>
          <div style={CARD_IDENTITY_STYLE}>
            <span title={plan.name} style={CARD_TITLE_STYLE}>
              {plan.name}
            </span>
          </div>

          <div style={CORNER_STYLE}>
            <Tag color={getPillColor(phaseAccent)}>{phaseLabel}</Tag>
            {running && (
              <HealthIndicator
                label={PPC.LABELS.HEALTH_LABELS[health]}
                accent={STATUS_COLORS.PLAN_HEALTH[health]}
                loud={PLAN_LOUD_HEALTH.includes(health)}
              />
            )}
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
                    if (key === 'approve') openDecision('approved');
                    if (key === 'reject') openDecision('rejected');
                    if (key === 'generateReport') void generateReport();
                  },
                }}
              >
                <Button
                  type="text"
                  shape="circle"
                  icon={<MoreOutlined rotate={90} />}
                  aria-label={CARD_TEXTS.ACTIONS_LABEL(plan.name)}
                  onClick={(e) => e.stopPropagation()}
                  style={menuButtonStyle}
                />
              </Dropdown>
            )}
          </div>
        </div>
        {description && (
          <span title={description} style={DESCRIPTION_STYLE}>
            {description}
          </span>
        )}
        {/* Keyed on the plan's ids, not the resolved names, so the row does not pop in when the lists load. */}
        {(plan.environmentRef || plan.kindRef || (plan.tagRefs?.length ?? 0) > 0) && (
          <span style={TAG_ROW_STYLE}>
            <CardTagList tags={classification} max={PLAN_CARD_MAX_TAGS} />
          </span>
        )}
      </div>

      {/* Window: its range and countdown on one line, then the rail running it down */}
      <div>
        <div style={WINDOW_LINE_STYLE}>
          <span style={WINDOW_LABEL_STYLE}>{planWindow.label}</span>
          <span title={planWindow.value} style={WINDOW_VALUE_STYLE}>
            {planWindow.value}
          </span>
          {planWindow.remaining && <span style={REMAINING_STYLE}>{planWindow.remaining}</span>}
        </div>
        {planWindow.showRail && (
          <div aria-hidden style={RAIL_TRACK_STYLE}>
            <div style={{ ...RAIL_FILL_STYLE, width: `${planWindow.percent}%` }} />
          </div>
        )}
      </div>

      {/* What the plan refuses, in the operator's words rather than template ids */}
      <CardChipSection
        label={CARD_LABELS.BLOCKED_LABEL[plan.mode][isPermanent ? 'permanent' : 'window']}
        emptyText={CARD_LABELS.REFUSES_NONE}
        items={policyLabels.map((label) => ({
          key: label,
          label,
          icon: plan.mode === 'audit' ? <EyeOutlined /> : <CloseOutlined />,
          accent: STATUS_COLORS.PLAN_MODE[plan.mode],
        }))}
      />

      {/* Grid rows stretch every card to one height: the auto margin keeps this group at the bottom. */}
      <div style={BOTTOM_STYLE}>
        <div style={META_LINE_STYLE}>
          <Tooltip title={targets.join(', ')}>
            <span
              tabIndex={0}
              aria-label={CARD_LABELS.SCOPE_TARGETS_LABEL(scopeValue, targets.join(', '))}
            >
              {scopeValue}
            </span>
          </Tooltip>
          {CARD_LABELS.META_SEPARATOR}
          {PPC.LABELS.MODE_LABELS[plan.mode]}
          {CARD_LABELS.META_SEPARATOR}
          {PPC.LABELS.DETAIL_PAGE.ACTIONS.DECISION_POLICIES_COUNT(policyLabels.length)}
        </div>
        {/* Provenance: when the plan last moved, and who created or requested it */}
        <span style={FOOTER_STYLE}>
          {CARD_TEXTS.UPDATED_PREFIX} <TimeAgo date={updatedAt} short exactRows={exactTimes} />
          {provenanceName && (
            <span title={provenanceActor}>
              {CARD_LABELS.META_SEPARATOR}
              {provenancePrefix} {provenanceName}
            </span>
          )}
        </span>
      </div>

      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <DeletePlanModal
          open={deleteModalOpen}
          planName={plan.name}
          loading={deleting}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
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
          loading={canceling}
          getContainer={() => document.body}
        />
        <ReactivatePlanModal
          open={reactivateModalOpen}
          planName={plan.name}
          repeating={plan.timeMode === 'repeating'}
          loading={reactivating}
          onClose={() => setReactivateModalOpen(false)}
          onConfirm={handleReactivate}
        />
        <ApprovalDecisionModal
          open={decisionModal !== null}
          decision={lastDecision}
          plan={plan}
          loading={deciding}
          onClose={() => setDecisionModal(null)}
          onConfirm={handleDecide}
        />
      </div>
      {duplicatePanelOpen && (
        <DuplicatePlanPanel
          key={`duplicate-${plan.id}`}
          open={duplicatePanelOpen}
          onClose={() => setDuplicatePanelOpen(false)}
          plan={plan}
        />
      )}
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
