import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { CloseOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  APP_CONFIGS,
  DEFAULT_COLORS,
  EMPTY_VALUE,
  SECTION_LAYOUT,
  SIDEBAR_LAYOUT,
  STATUS_COLORS,
  TAG_CLASS,
  TIME_FORMATS,
  TRUNCATE_STYLE,
  getPillColor,
  UNSTYLED_BUTTON,
  withAlpha,
  Z_INDEX,
  RADIUS,
  FONT_SIZE,
  SPACING,
  FONT_WEIGHT,
  MOTION,
} from '../../../../../constants';
import { formatDateTime, getTimeZone } from '../../../../../utils/shared/time';
import SettingsCard from '../../../../settings/components/SettingsCard';
import KeyValueGrid, {
  type KeyValueGridRow,
} from '../../../../applications/components/details/KeyValueGrid';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { CardChipSection } from '../../../../../components/display/card';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import { avatarRingStyle } from '../../../../../components/display/avatars/avatarRing';
import type { UserAvatar as UserAvatarModel } from '../../../../access-and-permissions/users/models';
import { ColumnShell } from '../../../../applications/pages/details/contentBlocks';
import HealthBadge from '../../components/shared/HealthBadge';
import HealthSection from '../../components/details/HealthSection';
import ViolationsSection, { resultLabel } from '../../components/details/ViolationsSection';
import ViolationsWindowNote from '../../components/details/ViolationsWindowNote';
import { emptyCopy } from '../../components/details/violationsCopy';
import { healthRows, isInForce } from '../../components/details/policyHealth';
import ReportsSection from '../../components/details/ReportsSection';
import ProtectionPlanDetailsToolbar from '../../components/layout/ProtectionPlanDetailsToolbar';
import { usePlanHealth } from '../../hooks/usePlanHealth';
import { usePlanViolations } from '../../hooks/usePlanViolations';
import { usePlanReports } from '../../hooks/usePlanReports';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../components/shared';
import type { ViolationsResultFilter } from '../../hooks/usePlanViolations';
import { Select } from 'antd';
import type { AppDispatch, RootState } from '../../../../../store';
import { fetchProtectionPlanTemplatesThunk, selectProtectionPlanTemplates } from '../../store';
import {
  POLICY_CHIP_LABEL,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import type { PlanApproval, PlanTimeRange, ProtectionPlan } from '../../models';
import { usePlanTaxonomies } from '../../hooks/usePlanTaxonomies';
import { useUsernamesByIds } from '../../../../../hooks/useUsernamesByIds';
import { liveWindow, planPhaseLabel } from '../../utils/phaseRules';
import { formatRepeatRule } from '../../utils/repeatRule';
import { encodeResourceKey } from '../../utils/planFormValues';
import { getCategoryName } from '../../../../access-and-permissions/categories/utils/helpers';

const AvatarRing: React.FC<{
  avatar?: UserAvatarModel;
  username?: string;
  size: number;
}> = ({ avatar, username, size }) => (
  <span style={avatarRingStyle(size)}>
    <UserAvatar avatar={avatar} username={username} size={size} style={{ border: 'none' }} />
  </span>
);

const policyIconStyle = (accent: string): React.CSSProperties => ({
  width: 20,
  height: 20,
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: RADIUS.SM,
  fontSize: FONT_SIZE.XXS,
  color: accent,
  background: withAlpha(accent, 0.14),
});

// 10 and 120ms: the refresh button's corner and hover fade sit between the RADIUS and MOTION steps.
const COMPACT_REFRESH_BUTTON_STYLE: React.CSSProperties = {
  color: DEFAULT_COLORS.ICON_SECONDARY,
  flexShrink: 0,
  width: 30,
  height: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  background: 'transparent',
  transition: `background 120ms ${MOTION.EASE}, color 120ms ${MOTION.EASE}`,
};

// A text button that keeps the browser's focus ring (no `all: unset`).
const STATUS_LINK_STYLE: React.CSSProperties = {
  ...UNSTYLED_BUTTON,
  display: 'inline-flex',
  alignItems: 'center',
  gap: SPACING.S6,
  font: 'inherit',
  color: 'inherit',
};

// Same as the gap between the page's cards.
const CARD_GAP_PX = SPACING.LG;

const formatRange = ({ startAt, endAt }: PlanTimeRange): string =>
  PPC.LABELS.PHASE_INFO.IN_TIME_ZONE(
    `${formatDateTime(startAt, TIME_FORMATS.DATE_TIME_12H)}${
      PPC.LABELS.CARD.RANGE_SEPARATOR
    }${formatDateTime(endAt, TIME_FORMATS.DATE_TIME_12H)}`,
    getTimeZone(),
  );

const scheduleText = (plan: ProtectionPlan): string => {
  if (plan.timeMode === 'repeating' && plan.repeat) return formatRepeatRule(plan.repeat);
  if (plan.timeMode === 'time_range' && plan.timeRange) return formatRange(plan.timeRange);
  return PPC.LABELS.DETAIL_PAGE.FIELDS.PERMANENT;
};

// A time range's declared window, or the one a running series is in or waits for.
const scheduleWindow = (plan: ProtectionPlan): PlanTimeRange | undefined =>
  plan.timeMode === 'time_range' ? plan.timeRange : liveWindow(plan);

const reportsDescription = (plan: ProtectionPlan): string =>
  plan.timeMode === 'repeating'
    ? PPC.LABELS.DETAIL_PAGE.SECTIONS.REPORTS_DESCRIPTION_SERIES
    : PPC.LABELS.DETAIL_PAGE.SECTIONS.REPORTS_DESCRIPTION;

const approvalRows = (
  approval: PlanApproval | undefined,
  renderUserAndTime: (userId: string | undefined, when: string | undefined) => React.ReactNode,
): KeyValueGridRow[] => {
  if (!approval) return [];
  const { FIELDS } = PPC.LABELS.DETAIL_PAGE;
  const rows: KeyValueGridRow[] = [
    {
      k: 'requested',
      label: FIELDS.REQUESTED_BY,
      value: renderUserAndTime(approval.requestedBy, approval.requestedAt),
    },
  ];
  if (approval.decidedBy) {
    rows.push({
      k: 'decided',
      label: approval.state === 'rejected' ? FIELDS.REJECTED_BY : FIELDS.APPROVED_BY,
      value: renderUserAndTime(approval.decidedBy, approval.decidedAt),
    });
  }
  if (approval.comment) {
    rows.push({ k: 'decisionComment', label: FIELDS.DECISION_COMMENT, value: approval.comment });
  }
  return rows;
};

// A series waiting for approval opens no window until it is approved.
const seriesWindowRows = (
  plan: ProtectionPlan,
  seriesWindow?: PlanTimeRange,
): KeyValueGridRow[] => {
  if (!seriesWindow) return [];
  const { CARD } = PPC.LABELS;
  const range = formatRange(seriesWindow);
  return [
    {
      k: 'window',
      label: plan.phase === 'active' ? CARD.CURRENT_WINDOW_LABEL : CARD.NEXT_WINDOW_LABEL,
      value:
        plan.phase === 'pending_approval'
          ? `${range}${CARD.META_SEPARATOR}${CARD.OPENS_ONCE_APPROVED}`
          : range,
    },
  ];
};

// The pills and the end time measure ~362px: below this the toolbar wraps, above it the status does.
const STATUS_MIN_WIDTH_PX = 380;

const renderChips = (chips: { key: string; text: string }[]) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.S6 }}>
    {chips.map((chip) => (
      <Tag key={chip.key} className={TAG_CLASS.AS_IS}>
        {chip.text}
      </Tag>
    ))}
  </div>
);

// The Scope card: what the plan targets, then what it leaves out.
const scopeRows = (plan: ProtectionPlan): KeyValueGridRow[] => {
  const { FIELDS } = PPC.LABELS.DETAIL_PAGE;
  const byApplication = plan.scope.type === 'applications';
  const targetsLabel = byApplication ? FIELDS.APPLICATIONS : FIELDS.NAMESPACES;
  const targets = (byApplication ? plan.scope.applicationRefs : plan.scope.namespaces) ?? [];
  const excludedKinds = plan.scope.exclusions?.kinds ?? [];
  const excludedResources = plan.scope.exclusions?.resources ?? [];
  const rows: KeyValueGridRow[] = [
    { k: 'scopeType', label: FIELDS.SCOPE_TYPE, value: targetsLabel },
    {
      k: 'scopeItems',
      label: targetsLabel,
      value:
        targets.length === 0
          ? EMPTY_VALUE
          : renderChips(targets.map((item) => ({ key: item, text: item.toLowerCase() }))),
    },
  ];
  if (excludedKinds.length > 0) {
    rows.push({
      k: 'excludedKinds',
      label: FIELDS.EXCLUDED_KINDS,
      value: renderChips(excludedKinds.map((kind) => ({ key: kind, text: kind.toLowerCase() }))),
    });
  }
  if (excludedResources.length > 0) {
    rows.push({
      k: 'excludedResources',
      label: FIELDS.EXCLUDED_RESOURCES,
      value: renderChips(
        excludedResources.map((r) => ({
          key: encodeResourceKey(r),
          text: `${r.kind.toLowerCase()} \u00b7 ${r.name}`,
        })),
      ),
    });
  }
  return rows;
};

interface ProtectionPlanDetailsContentProps {
  plan: ProtectionPlan;
  duplicating: boolean;
  editing: boolean;
  canceling: boolean;
  reactivating: boolean;
  approving: boolean;
  rejecting: boolean;
  deleting: boolean;
  refreshingHealth: boolean;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onReactivate: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onRefreshHealth: () => void;
}

const { viewViolations, viewReports } = ACTION_PERMISSIONS.protectionPlans;
const { FORM } = PPC.CREATE_PAGE;

const ProtectionPlanDetailsContent: React.FC<ProtectionPlanDetailsContentProps> = memo(
  ({
    plan,
    duplicating,
    editing,
    canceling,
    reactivating,
    approving,
    rejecting,
    deleting,
    refreshingHealth,
    onDuplicate,
    onEdit,
    onCancel,
    onReactivate,
    onApprove,
    onReject,
    onDelete,
    onRefreshHealth,
  }) => {
    const phaseLabel = planPhaseLabel(plan);
    const phaseAccent = STATUS_COLORS.PLAN_PHASE[plan.phase] ?? STATUS_COLORS.PLAN_PHASE.draft;
    const revision = `${plan.phase}:${plan.lastUpdatedAt ?? ''}`;
    const health = usePlanHealth(plan.id, revision);
    const canViewViolations = usePermission(
      viewViolations.scope,
      viewViolations.level,
      viewViolations.deny,
    );
    const canViewReports = usePermission(viewReports.scope, viewReports.level, viewReports.deny);
    const canDownloadReport = usePermission(
      ACTION_PERMISSIONS.protectionPlans.downloadReport.scope,
      ACTION_PERMISSIONS.protectionPlans.downloadReport.level,
      ACTION_PERMISSIONS.protectionPlans.downloadReport.deny,
    );
    const canGenerateReport = usePermission(
      ACTION_PERMISSIONS.protectionPlans.generateReport.scope,
      ACTION_PERMISSIONS.protectionPlans.generateReport.level,
      ACTION_PERMISSIONS.protectionPlans.generateReport.deny,
    );
    const violations = usePlanViolations(plan.id, canViewViolations);
    const reports = usePlanReports(plan.id, revision, canViewReports);
    const { generate: generateReport } = reports;
    const handleGenerateReport = useCallback(() => {
      void generateReport();
    }, [generateReport]);
    const violationsFilterOptions: Array<{ value: ViolationsResultFilter; label: string }> = [
      { value: 'all', label: PPC.LABELS.VIOLATIONS.FILTER_ALL },
      ...(['fail', 'pass', 'warn', 'error', 'skip'] as const).map((value) => ({
        value,
        label: resultLabel(value, plan.mode),
      })),
    ];

    const dispatch: AppDispatch = useDispatch();
    const templates = useSelector(selectProtectionPlanTemplates);
    // Template codes map rendered policy names to operation labels in Health and the decisions.
    useEffect(() => {
      if (templates.length === 0) void dispatch(fetchProtectionPlanTemplatesThunk());
    }, [templates.length, dispatch]);

    const notInForce =
      plan.phase === 'active'
        ? healthRows(plan, health.status).filter((row) => !isInForce(row, plan.mode)).length
        : 0;
    const healthState = health.status?.health ?? plan.health;
    const barRef = useRef<HTMLDivElement>(null);
    const healthRef = useRef<HTMLDivElement>(null);
    // The pane scrolls, not the window, and the bar, stuck at the pane's top, would cover the card.
    const scrollToHealth = useCallback(() => {
      const pane = document.getElementById(APP_CONFIGS.LAYOUT.CONTENT_ID);
      const target = healthRef.current;
      if (!pane || !target) return;
      const stuckBarBottom = pane.getBoundingClientRect().top + (barRef.current?.offsetHeight ?? 0);
      pane.scrollBy({
        top: target.getBoundingClientRect().top - stuckBarBottom - CARD_GAP_PX,
        behavior: globalThis.matchMedia(SIDEBAR_LAYOUT.REDUCED_MOTION_QUERY).matches
          ? 'auto'
          : 'smooth',
      });
      target.focus({ preventScroll: true });
    }, []);
    const users = useSelector((s: RootState) => s.users.users);
    const taxonomies = usePlanTaxonomies();
    // Participants too: the users list is empty when the page is opened directly.
    const actorIds = useMemo(
      () =>
        [
          plan.createdBy,
          plan.lastUpdatedBy,
          plan.approval?.requestedBy,
          plan.approval?.decidedBy,
          ...(plan.participantRefs ?? []),
        ].filter((id): id is string => Boolean(id)),
      [plan],
    );
    const usernamesById = useUsernamesByIds(actorIds, true);

    const participants = useMemo(
      () =>
        (plan.participantRefs ?? []).map((id) => {
          const user = users.find((u) => u.id === id);
          return { id, user, username: user?.username ?? usernamesById[id] ?? id };
        }),
      [plan.participantRefs, users, usernamesById],
    );

    const renderUserAndTime = useCallback(
      (userId: string | undefined, when: string | undefined): React.ReactNode => {
        const user = userId ? users.find((u) => u.id === userId) : undefined;
        const display = user?.username ?? (userId ? usernamesById[userId] : undefined);
        const timeNode = when ? <TimeAgo date={when} /> : EMPTY_VALUE;
        if (!userId || !display) return timeNode;
        return (
          // One line, so every row is the same height: the time gives way first, then the name.
          <span style={{ display: 'flex', alignItems: 'center', gap: SPACING.XS, minWidth: 0 }}>
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.S6, minWidth: 0 }}
            >
              <AvatarRing avatar={user?.avatar} username={display} size={20} />
              <span
                title={userId}
                style={{
                  ...TRUNCATE_STYLE,
                  fontSize: FONT_SIZE.MD,
                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                }}
              >
                {display}
              </span>
            </span>
            {when && (
              <>
                <span
                  style={{
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    margin: `0 ${SPACING.XXS}px`,
                    flexShrink: 0,
                  }}
                >
                  ·
                </span>
                <span style={{ ...TRUNCATE_STYLE, flexShrink: 100000 }}>{timeNode}</span>
              </>
            )}
          </span>
        );
      },
      [users, usernamesById],
    );

    const seriesWindow = liveWindow(plan);
    const schedule = scheduleWindow(plan);
    const overviewRows = useMemo(() => {
      const tags = (plan.tagRefs ?? [])
        .map((id) => ({ id, name: taxonomies.tags.find((c) => c.id === id)?.name }))
        .filter((t): t is { id: string; name: string } => Boolean(t.name));
      return [
        { k: 'name', label: PPC.LABELS.DETAIL_PAGE.FIELDS.NAME, value: plan.name },
        {
          k: 'description',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.DESCRIPTION,
          value: plan.description || EMPTY_VALUE,
        },
        {
          k: 'severity',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.SEVERITY,
          value: plan.severity || EMPTY_VALUE,
        },
        {
          k: 'priority',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.PRIORITY,
          value: plan.priority ?? EMPTY_VALUE,
        },
        {
          k: 'kind',
          label: FORM.KIND_LABEL,
          value: getCategoryName(plan.kindRef ?? '', taxonomies.kinds),
        },
        {
          k: 'environment',
          label: FORM.ENVIRONMENT_LABEL,
          value: getCategoryName(plan.environmentRef ?? '', taxonomies.environments),
        },
        {
          k: 'tags',
          label: FORM.TAGS_LABEL,
          value:
            tags.length === 0 ? (
              EMPTY_VALUE
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.S6 }}>
                {tags.map(({ id, name }) => (
                  <Tag key={id} className={`${TAG_CLASS.XSMALL} ${TAG_CLASS.AS_IS}`}>
                    {name}
                  </Tag>
                ))}
              </div>
            ),
        },
        {
          k: 'execution',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.EXECUTION,
          value: PPC.LABELS.EXECUTION_LABELS[plan.approvalMode ?? 'automatic'],
        },
        ...approvalRows(plan.approval, renderUserAndTime),
        { k: 'mode', label: PPC.LABELS.DETAIL_PAGE.FIELDS.MODE, value: plan.mode },
        { k: 'timeMode', label: PPC.LABELS.CARD.WINDOW_LABEL, value: scheduleText(plan) },
        ...seriesWindowRows(plan, seriesWindow),
        ...(plan.reason && (plan.phase === 'failed' || plan.phase === 'canceled')
          ? [
              {
                k: 'reason',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.REASON,
                value: plan.reason,
              },
            ]
          : []),
      ];
    }, [
      plan,
      seriesWindow,
      renderUserAndTime,
      taxonomies.kinds,
      taxonomies.environments,
      taxonomies.tags,
    ]);

    // Who made and moved the plan, and who takes part in it: the Overview's right half.
    const activityRows = useMemo(
      () => [
        {
          k: 'created',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.CREATED,
          value: renderUserAndTime(plan.createdBy, plan.createdAt),
        },
        ...(plan.startedAt
          ? [
              {
                k: 'started',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.STARTED,
                value: renderUserAndTime(plan.startedBy, plan.startedAt),
              },
            ]
          : []),
        {
          k: 'updated',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.UPDATED,
          value: renderUserAndTime(plan.lastUpdatedBy, plan.lastUpdatedAt),
        },
        ...(plan.terminatedAt
          ? [
              {
                k: 'terminated',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.TERMINATED,
                value: renderUserAndTime(plan.terminatedBy, plan.terminatedAt),
              },
            ]
          : []),
        {
          k: 'participants',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.PARTICIPANTS,
          value:
            participants.length === 0 ? (
              EMPTY_VALUE
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.SM }}>
                {participants.map(({ id, user, username }) => (
                  <div
                    key={id}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.SM }}
                  >
                    <AvatarRing avatar={user?.avatar} username={username} size={20} />
                    <span
                      title={id}
                      style={{ fontSize: FONT_SIZE.MD, color: DEFAULT_COLORS.TEXT_PRIMARY }}
                    >
                      {username}
                    </span>
                  </div>
                ))}
              </div>
            ),
        },
      ],
      [plan, renderUserAndTime, participants],
    );

    const policies = plan.policies ?? [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.LG }}>
        <div
          ref={barRef}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: Z_INDEX.STICKY,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            // The status grows into the row, so this only right-aligns a toolbar that wrapped.
            justifyContent: 'flex-end',
            gap: SPACING.MD,
            padding: `${SPACING.SM}px 0`,
            background: DEFAULT_COLORS.PAGE_BG,
          }}
        >
          <div
            style={{
              flex: `1 1 ${STATUS_MIN_WIDTH_PX}px`,
              display: 'flex',
              alignItems: 'center',
              columnGap: SPACING.MD,
              rowGap: SPACING.S6,
              flexWrap: 'wrap',
              fontSize: FONT_SIZE.MD,
              color: DEFAULT_COLORS.TEXT_SECONDARY,
            }}
          >
            <span style={{ display: 'inline-flex', gap: SPACING.S6 }}>
              <Tag color={getPillColor(phaseAccent)}>{phaseLabel}</Tag>
              <Tag>{PPC.LABELS.MODE_LABELS[plan.mode]}</Tag>
            </span>
            {plan.phase === 'scheduled' && schedule && (
              <span>
                {PPC.LABELS.PHASE_INFO.STARTS_PREFIX} <TimeAgo date={schedule.startAt} />
                {schedule.endAt && (
                  <>
                    {' · '}
                    {PPC.LABELS.PHASE_INFO.ENDS_PREFIX} <TimeAgo date={schedule.endAt} />
                  </>
                )}
              </span>
            )}
            {plan.phase === 'pending_approval' && plan.approval && (
              <span>
                {PPC.LABELS.PHASE_INFO.AWAITING_APPROVAL_PREFIX}{' '}
                <TimeAgo date={plan.approval.requestedAt} />
              </span>
            )}
            {plan.phase === 'active' && schedule?.endAt && (
              <span>
                {PPC.LABELS.PHASE_INFO.ENDS_PREFIX} <TimeAgo date={schedule.endAt} />
                {PPC.LABELS.CARD.META_SEPARATOR}
                {PPC.LABELS.PHASE_INFO.IN_TIME_ZONE(
                  formatDateTime(schedule.endAt, PPC.LABELS.PHASE_INFO.END_TIME_FORMAT),
                  getTimeZone(),
                )}
              </span>
            )}
            {plan.phase === 'active' && plan.timeMode === 'permanent' && (
              <span>{PPC.LABELS.CARD.PERMANENT_RANGE}</span>
            )}
            {plan.phase === 'active' &&
              healthState &&
              (notInForce > 0 ? (
                <button type="button" onClick={scrollToHealth} style={STATUS_LINK_STYLE}>
                  <HealthBadge health={healthState} compact />
                  {PPC.LABELS.HEALTH_LABELS[healthState]}
                  {PPC.LABELS.CARD.META_SEPARATOR}
                  <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    {PPC.LABELS.HEALTH_DETAIL.STATUS_NOT_IN_FORCE(notInForce)}
                  </span>
                </button>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.S6 }}>
                  <HealthBadge health={healthState} compact />
                  {PPC.LABELS.HEALTH_LABELS[healthState]}
                </span>
              ))}
            {plan.phase === 'terminated' && plan.terminatedAt && (
              <span>
                {PPC.LABELS.PHASE_INFO.TERMINATED_PREFIX} <TimeAgo date={plan.terminatedAt} />
              </span>
            )}
          </div>
          <ProtectionPlanDetailsToolbar
            plan={plan}
            duplicating={duplicating}
            editing={editing}
            canceling={canceling}
            reactivating={reactivating}
            approving={approving}
            rejecting={rejecting}
            deleting={deleting}
            refreshingHealth={refreshingHealth}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
            onCancel={onCancel}
            onReactivate={onReactivate}
            onApprove={onApprove}
            onReject={onReject}
            onDelete={onDelete}
            onRefreshHealth={onRefreshHealth}
            generatingReport={reports.generating}
            onGenerateReport={handleGenerateReport}
          />
        </div>

        {/* What the plan refuses, the same chips as its card. */}
        <CardChipSection
          label={
            PPC.LABELS.CARD.BLOCKED_LABEL[plan.mode][
              plan.timeMode === 'permanent' ? 'permanent' : 'window'
            ]
          }
          emptyText={PPC.LABELS.CARD.REFUSES_NONE}
          items={policies.map((p) => ({
            key: p.templateID,
            label: POLICY_CHIP_LABEL[p.templateID] ?? p.templateID,
            icon: plan.mode === 'audit' ? <EyeOutlined /> : <CloseOutlined />,
            accent: STATUS_COLORS.PLAN_MODE[plan.mode],
          }))}
        />

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_DESCRIPTION}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: SPACING.MD,
              alignItems: 'start',
            }}
          >
            <ColumnShell title={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_COLUMN_PRIMARY}>
              <KeyValueGrid rows={overviewRows} />
            </ColumnShell>
            <ColumnShell title={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_COLUMN_ACTIVITY}>
              <KeyValueGrid rows={activityRows} />
            </ColumnShell>
          </div>
        </SettingsCard>

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.SCOPE_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.SCOPE_DESCRIPTION}
        >
          <KeyValueGrid rows={scopeRows(plan)} />
        </SettingsCard>

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.POLICIES_TITLE}
          description={
            PPC.LABELS.CARD.BLOCKED_LABEL[plan.mode][
              plan.timeMode === 'permanent' ? 'permanent' : 'window'
            ]
          }
        >
          {policies.length === 0 ? (
            <div style={{ fontSize: FONT_SIZE.MD, color: DEFAULT_COLORS.TEXT_MUTED }}>
              {EMPTY_VALUE}
            </div>
          ) : (
            <div>
              {policies.map((p, idx) => (
                <div
                  key={`${p.templateID}-${idx}`}
                  // 10: the row padding sits between SM and MD.
                  style={{
                    padding: '10px 0',
                    borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: SPACING.SM,
                  }}
                >
                  {/* What the policy refuses, in the card's words, over its template id. */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: SPACING.SM, minWidth: 0 }}
                  >
                    <span aria-hidden style={policyIconStyle(STATUS_COLORS.PLAN_MODE[plan.mode])}>
                      {plan.mode === 'audit' ? <EyeOutlined /> : <CloseOutlined />}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: SPACING.NONE,
                        minWidth: 0,
                      }}
                    >
                      <span
                        // 1.3: the policy name's leading sits between TIGHT and SNUG.
                        style={{
                          fontSize: FONT_SIZE.MD,
                          fontWeight: FONT_WEIGHT.SEMIBOLD,
                          lineHeight: 1.3,
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                        }}
                      >
                        {POLICY_CHIP_LABEL[p.templateID] ?? p.templateID}
                      </span>
                      {POLICY_CHIP_LABEL[p.templateID] ? (
                        <span
                          // 1.3: the same leading as the policy name above.
                          style={{
                            fontSize: FONT_SIZE.SM,
                            lineHeight: 1.3,
                            color: DEFAULT_COLORS.TEXT_MUTED,
                          }}
                        >
                          {p.templateID}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {p.params && Object.keys(p.params).length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: SPACING.S6,
                        justifyContent: 'flex-end',
                      }}
                    >
                      {Object.entries(p.params).map(([key, value]) => (
                        <Tag key={key} className={TAG_CLASS.AS_IS}>
                          {`${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SettingsCard>

        {plan.phase === 'active' && (
          // Focusable so the status line's jump leaves keyboard focus here.
          <div ref={healthRef} tabIndex={-1}>
            <SettingsCard
              title={PPC.LABELS.DETAIL_PAGE.SECTIONS.HEALTH_TITLE}
              description={PPC.LABELS.DETAIL_PAGE.SECTIONS.HEALTH_DESCRIPTION}
              headerAction={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: SPACING.MD,
                    flexWrap: 'wrap',
                  }}
                >
                  <HealthBadge health={healthState} />
                  {plan.healthCheckedAt && (
                    <span style={{ fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}>
                      {PPC.LABELS.HEALTH_DETAIL.CHECKED_AT}: <TimeAgo date={plan.healthCheckedAt} />
                    </span>
                  )}
                  <Tooltip title={PPC.LABELS.HEALTH_DETAIL.REFRESH_BUTTON}>
                    <Button
                      type="text"
                      shape="circle"
                      icon={<ReloadOutlined />}
                      onClick={health.refresh}
                      style={COMPACT_REFRESH_BUTTON_STYLE}
                      aria-label={PPC.LABELS.HEALTH_DETAIL.REFRESH_BUTTON}
                    />
                  </Tooltip>
                </div>
              }
            >
              <HealthSection
                plan={plan}
                status={health.status}
                loading={health.loading}
                error={health.error}
              />
            </SettingsCard>
          </div>
        )}

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_DESCRIPTION}
          headerAction={
            canViewViolations ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.SM }}>
                <Select
                  value={violations.resultFilter}
                  onChange={(v) => violations.setResultFilter(v)}
                  options={violationsFilterOptions}
                  size="small"
                  style={{ width: 140 }}
                  placeholder={PPC.LABELS.VIOLATIONS.FILTER_PLACEHOLDER}
                />
                <Tooltip title={PPC.LABELS.VIOLATIONS.REFRESH}>
                  <Button
                    type="text"
                    shape="circle"
                    icon={<ReloadOutlined />}
                    onClick={violations.refresh}
                    style={COMPACT_REFRESH_BUTTON_STYLE}
                    aria-label={PPC.LABELS.VIOLATIONS.REFRESH}
                  />
                </Tooltip>
              </div>
            ) : undefined
          }
        >
          {canViewViolations ? (
            <>
              <ViolationsWindowNote
                plan={plan}
                data={violations.data}
                reports={reports}
                canViewReports={canViewReports}
                canGenerate={canGenerateReport}
                canDownload={canDownloadReport}
              />
              <ViolationsSection
                data={violations.data}
                loading={violations.loading}
                error={violations.error}
                planId={plan.id}
                mode={plan.mode}
                empty={emptyCopy(plan, violations.data)}
              />
            </>
          ) : (
            <NoPermissionCard
              featureName={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_TITLE}
              permission={viewViolations}
              emptyState
            />
          )}
        </SettingsCard>

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.REPORTS_TITLE}
          description={reportsDescription(plan)}
          headerAction={
            canViewReports ? (
              <Tooltip title={PPC.LABELS.REPORTS.REFRESH}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<ReloadOutlined />}
                  onClick={reports.refresh}
                  style={COMPACT_REFRESH_BUTTON_STYLE}
                  aria-label={PPC.LABELS.REPORTS.REFRESH}
                />
              </Tooltip>
            ) : undefined
          }
        >
          {canViewReports ? (
            <ReportsSection
              data={reports.reports}
              loading={reports.loading}
              error={reports.error}
              downloading={reports.downloading}
              phase={plan.phase}
              repeating={plan.timeMode === 'repeating'}
              planName={plan.name}
              users={users}
              canDownload={canDownloadReport}
              onDownload={reports.download}
              onDeleted={reports.refresh}
            />
          ) : (
            <NoPermissionCard
              featureName={PPC.LABELS.DETAIL_PAGE.SECTIONS.REPORTS_TITLE}
              permission={viewReports}
              emptyState
            />
          )}
        </SettingsCard>
      </div>
    );
  },
);

ProtectionPlanDetailsContent.displayName = 'ProtectionPlanDetailsContent';

export default ProtectionPlanDetailsContent;
