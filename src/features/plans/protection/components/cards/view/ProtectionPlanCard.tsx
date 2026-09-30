import React, { memo, useCallback, useState } from 'react';
import { App as AntdApp, Button, Dropdown, Form } from 'antd';
import type { MenuProps } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  ACTORS,
  APP_ROUTES,
  CARD_ASIDE_STYLE,
  CARD_FOOTER_STYLE,
  CARD_HEADER_STYLE,
  CARD_IDENTITY_STYLE,
  CARD_LAYOUT,
  CARD_STATS_GRID_STYLE,
  CARD_TAG_ROW_STYLE,
  CARD_TITLE_COLUMN_STYLE,
  CARD_TITLE_STYLE,
  DEFAULT_COLORS,
  MICRO_LABEL_STYLE,
  TRUNCATE_STYLE,
  getCardMenuButtonStyle,
  getCardShellStyle,
} from '../../../../../../constants';
import type { PlanApprovalDecision, ProtectionPlan } from '../../../models';
import type { FormValues } from '../../create';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  HEALTH_ACCENT,
  PHASE_ACCENT,
  POLICY_CHIP_LABEL,
} from '../../../constants/protectionPlans';
import RowTag from '../../../../../../components/display/table/RowTag';
import {
  CardChipSection,
  CardIconChip,
  CardStatusPill,
  StatCell,
} from '../../../../../../components/display/card';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import TimeRemaining from '../../../../../../components/display/time/TimeRemaining';
import { formatDateTime, toTimestamp } from '../../../../../../utils/shared/time';
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
  permissionTooltip,
  planPhaseLabel,
} from '../../../utils/phaseRules';
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
const EMPTY_VALUE = '';

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
    : CARD_LABELS.APPLICATIONS_COUNT(plan.scope.applicationRefs?.length ?? 0);

const buildTargets = (plan: ProtectionPlan): string[] =>
  (plan.scope.type === 'namespaces' ? plan.scope.namespaces : plan.scope.applicationRefs) ?? [];

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan, onOpen, names }) => {
  const dispatch: AppDispatch = useDispatch();
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
  const provenanceName = provenanceActor ? names[provenanceActor] : ACTORS.NONE;
  const provenancePrefix = awaitingApproval
    ? CARD_LABELS.AWAITING_APPROVAL_BY_PREFIX
    : CARD_LABELS.CREATED_BY_PREFIX;
  const provenanceLabel = provenanceName ? `${provenancePrefix} ${provenanceName}` : EMPTY_VALUE;

  const phaseLabel = planPhaseLabel(plan);
  const canCancel = CANCELLABLE_PHASES.includes(plan.phase);

  const phaseAccent = PHASE_ACCENT[plan.phase] ?? DEFAULT_COLORS.NEUTRAL;
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
  const environmentName = environments.find((c) => c.id === plan.environmentRef)?.name;
  const planTags = (plan.tagRefs ?? [])
    .map((id) => ({ id, name: tags.find((c) => c.id === id)?.name }))
    .filter((t): t is { id: string; name: string } => Boolean(t.name));
  const shownTags = planTags.slice(0, CARD_LAYOUT.MAX_TARGET_TAGS);
  const hiddenTagNames = planTags.length - shownTags.length;
  const policyLabels = (plan.policies ?? []).map(
    (policy) => POLICY_CHIP_LABEL[policy.templateID] ?? policy.templateID,
  );

  const menuButtonStyle = getCardMenuButtonStyle(menuOpen);

  const handleCancel = useCallback(async () => {
    setCancelling(true);
    try {
      await dispatch(cancelPlanThunk({ planId: plan.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.CANCEL_SUCCESS(plan.name));
      setCancelModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.CANCEL_ERROR);
    } finally {
      setCancelling(false);
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

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await dispatch(deletePlanThunk({ planId: plan.id })).unwrap();
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
    ...(canCancel
      ? [
          {
            key: 'cancel',
            label: PPC.LABELS.ACTIONS.CANCEL,
            icon: <StopOutlined />,
            danger: true,
            disabled: !canCancelPlan || cancelling,
            title: permissionTooltip(canCancelPlan, PD.CANCEL),
          },
        ]
      : []),
    { type: 'divider' },
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
      style={getCardShellStyle(hovered)}
    >
      {/* Header: identity on the left, phase pill and actions on the right */}
      <div style={CARD_HEADER_STYLE}>
        <div style={CARD_IDENTITY_STYLE}>
          <CardIconChip icon={<SafetyCertificateOutlined />} accent={phaseAccent} />
          <span style={CARD_TITLE_COLUMN_STYLE}>
            <span title={plan.name} style={CARD_TITLE_STYLE}>
              {plan.name}
            </span>
            <span style={CARD_TAG_ROW_STYLE}>
              {shownTargets.map((target) => (
                <RowTag
                  key={target}
                  text={target}
                  capitalize={false}
                  fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                  truncate
                />
              ))}
              {hiddenTargets > 0 && (
                <RowTag
                  text={CARD_LABELS.MORE_BLOCKED(hiddenTargets)}
                  capitalize={false}
                  fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                  truncate
                />
              )}
            </span>
            {/* Keyed on the plan's ids, not the resolved names, so the row does not pop in when the lists load. */}
            {(plan.environmentRef || (plan.tagRefs?.length ?? 0) > 0) && (
              <span style={{ ...CARD_TAG_ROW_STYLE, minHeight: CARD_LAYOUT.TAG_ROW_MIN_HEIGHT_PX }}>
                {environmentName && (
                  <RowTag
                    text={environmentName}
                    capitalize={false}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                    truncate
                  />
                )}
                {shownTags.map(({ id, name }) => (
                  <RowTag
                    key={id}
                    text={name}
                    capitalize={false}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                    truncate
                  />
                ))}
                {hiddenTagNames > 0 && (
                  <RowTag
                    text={CARD_LABELS.MORE_BLOCKED(hiddenTagNames)}
                    capitalize={false}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                    truncate
                  />
                )}
              </span>
            )}
          </span>
        </div>

        <div style={CARD_ASIDE_STYLE}>
          <CardStatusPill label={phaseLabel} accent={phaseAccent} />
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
              background: DEFAULT_COLORS.HOVER_BG,
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
      <div style={CARD_STATS_GRID_STYLE}>
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
      <CardChipSection
        label={isPermanent ? CARD_LABELS.BLOCKED_LABEL_PERMANENT : CARD_LABELS.BLOCKED_LABEL}
        emptyText={CARD_LABELS.REFUSES_NONE}
        items={policyLabels.map((label) => ({
          key: label,
          label,
          icon: <CloseOutlined />,
          accent: DEFAULT_COLORS.DANGER,
        }))}
      />

      {/* Provenance: who put this window in place and when it last moved */}
      <div style={CARD_FOOTER_STYLE}>
        <span style={TRUNCATE_STYLE} title={provenanceActor}>
          {provenanceLabel}
        </span>
        <span style={TRUNCATE_STYLE}>
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
          note={PPC.LABELS.ACTIONS.DELETE_MODAL_NOTE}
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
