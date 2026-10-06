import React, { memo, useCallback, useMemo } from 'react';
import { Button, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import {
  DEFAULT_COLORS,
  EMPTY_VALUE,
  MONOSPACE_CLASS,
  TIME_FORMATS,
} from '../../../../../constants';
import { formatDateTime } from '../../../../../utils/shared/time';
import SettingsCard from '../../../../settings/components/SettingsCard';
import KeyValueGrid from '../../../../applications/components/details/KeyValueGrid';
import RowTag from '../../../../../components/display/table/RowTag';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import TimeRemaining from '../../../../../components/display/time/TimeRemaining';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import { avatarRingStyle } from '../../../../../components/display/avatars/avatarRing';
import type { UserAvatar as UserAvatarModel } from '../../../../access-and-permissions/users/models';
import { ColumnShell } from '../../../../applications/pages/details/contentBlocks';
import HealthBadge from '../../components/shared/HealthBadge';
import HealthSection from '../../components/details/HealthSection';
import ViolationsSection from '../../components/details/ViolationsSection';
import ReportsSection from '../../components/details/ReportsSection';
import ProtectionPlanDetailsToolbar from '../../components/layout/ProtectionPlanDetailsToolbar';
import { usePlanHealth } from '../../hooks/usePlanHealth';
import { usePlanViolations } from '../../hooks/usePlanViolations';
import { usePlanReports } from '../../hooks/usePlanReports';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../components/shared';
import type { ViolationsResultFilter } from '../../hooks/usePlanViolations';
import { Select } from 'antd';
import type { RootState } from '../../../../../store';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  CARD_LAYOUT,
  PHASE_DOT_COLOR,
} from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';
import { usePlanTaxonomies } from '../../hooks/usePlanTaxonomies';
import { useUsernamesByIds } from '../../../../../hooks/useUsernamesByIds';
import { planPhaseLabel } from '../../utils/phaseRules';
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
  transition: 'background 120ms ease, color 120ms ease',
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
    const dotColor = PHASE_DOT_COLOR[plan.phase] ?? PHASE_DOT_COLOR.draft;
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
    const violations = usePlanViolations(plan.id, canViewViolations);
    const reports = usePlanReports(plan.id, revision, canViewReports);
    const { generate: generateReport } = reports;
    const handleGenerateReport = useCallback(() => {
      void generateReport();
    }, [generateReport]);
    const violationsFilterOptions: Array<{ value: ViolationsResultFilter; label: string }> = [
      { value: 'all', label: PPC.LABELS.VIOLATIONS.FILTER_ALL },
      { value: 'fail', label: PPC.LABELS.VIOLATION_RESULT_LABELS.fail },
      { value: 'pass', label: PPC.LABELS.VIOLATION_RESULT_LABELS.pass },
      { value: 'warn', label: PPC.LABELS.VIOLATION_RESULT_LABELS.warn },
      { value: 'error', label: PPC.LABELS.VIOLATION_RESULT_LABELS.error },
      { value: 'skip', label: PPC.LABELS.VIOLATION_RESULT_LABELS.skip },
    ];
    const users = useSelector((s: RootState) => s.users.users);
    const taxonomies = usePlanTaxonomies();
    const participants = useMemo(() => {
      const ids = plan.participantRefs ?? [];
      return ids.map((id) => {
        const user = users.find((u) => u.id === id);
        return { id, user };
      });
    }, [plan.participantRefs, users]);

    const actorIds = useMemo(
      () =>
        [
          plan.createdBy,
          plan.lastUpdatedBy,
          plan.approval?.requestedBy,
          plan.approval?.decidedBy,
        ].filter((id): id is string => Boolean(id)),
      [plan],
    );
    const usernamesById = useUsernamesByIds(actorIds, true);

    const renderUserAndTime = useCallback(
      (userId: string | undefined, when: string | undefined): React.ReactNode => {
        const user = userId ? users.find((u) => u.id === userId) : undefined;
        const display = user?.username ?? (userId ? usernamesById[userId] : undefined);
        const timeNode = when ? <TimeAgo date={when} /> : EMPTY_VALUE;
        if (!userId || !display) return timeNode;
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <AvatarRing avatar={user?.avatar} username={display} size={20} />
              <span title={userId} style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                {display}
              </span>
            </span>
            {when && (
              <>
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, margin: '0 2px' }}>·</span>
                {timeNode}
              </>
            )}
          </span>
        );
      },
      [users, usernamesById],
    );

    const overviewRows = useMemo(() => {
      const tags = (plan.tagRefs ?? [])
        .map((id) => ({ id, name: taxonomies.tags.find((c) => c.id === id)?.name }))
        .filter((t): t is { id: string; name: string } => Boolean(t.name));
      const approval = plan.approval;
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.map(({ id, name }) => (
                  <RowTag
                    key={id}
                    text={name}
                    fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
                    capitalize={false}
                  />
                ))}
              </div>
            ),
        },
        {
          k: 'execution',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.EXECUTION,
          value: PPC.LABELS.EXECUTION_LABELS[plan.approvalMode ?? 'automatic'],
        },
        ...(approval
          ? [
              {
                k: 'requested',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.REQUESTED_BY,
                value: renderUserAndTime(approval.requestedBy, approval.requestedAt),
              },
            ]
          : []),
        ...(approval?.decidedBy
          ? [
              {
                k: 'decided',
                label:
                  approval.state === 'rejected'
                    ? PPC.LABELS.DETAIL_PAGE.FIELDS.REJECTED_BY
                    : PPC.LABELS.DETAIL_PAGE.FIELDS.APPROVED_BY,
                value: renderUserAndTime(approval.decidedBy, approval.decidedAt),
              },
            ]
          : []),
        ...(approval?.comment
          ? [
              {
                k: 'decisionComment',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.DECISION_COMMENT,
                value: approval.comment,
              },
            ]
          : []),
        { k: 'mode', label: PPC.LABELS.DETAIL_PAGE.FIELDS.MODE, value: plan.mode },
        {
          k: 'timeMode',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.TIME_MODE,
          value:
            plan.timeMode === 'time_range' && plan.timeRange ? (
              <span>
                {formatDateTime(plan.timeRange.startAt, TIME_FORMATS.DATE_TIME_12H)} →{' '}
                {formatDateTime(plan.timeRange.endAt, TIME_FORMATS.DATE_TIME_12H)}
              </span>
            ) : (
              PPC.LABELS.DETAIL_PAGE.FIELDS.PERMANENT
            ),
        },
        {
          k: 'created',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.CREATED,
          value: renderUserAndTime(plan.createdBy, plan.createdAt),
        },
        {
          k: 'updated',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.UPDATED,
          value: renderUserAndTime(plan.lastUpdatedBy, plan.lastUpdatedAt),
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
        ...(plan.terminatedAt
          ? [
              {
                k: 'terminated',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.TERMINATED,
                value: renderUserAndTime(plan.terminatedBy, plan.terminatedAt),
              },
            ]
          : []),
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
    }, [plan, renderUserAndTime, taxonomies.environments, taxonomies.tags]);

    const scopeItems =
      (plan.scope.type === 'applications' ? plan.scope.applicationRefs : plan.scope.namespaces) ??
      [];
    const policies = plan.policies ?? [];
    const excludedKinds = plan.scope.exclusions?.kinds ?? [];
    const excludedResources = plan.scope.exclusions?.resources ?? [];
    const renderChips = (chips: { key: string; text: string }[]) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {chips.map((chip) => (
          <RowTag key={chip.key} text={chip.text} fontSize={11} capitalize={false} />
        ))}
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '8px 0',
            background: DEFAULT_COLORS.PAGE_BG,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: dotColor,
                  boxShadow: `0 0 0 3px ${DEFAULT_COLORS.CHIP_CUSTOM_BG}`,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  textTransform: 'capitalize',
                }}
              >
                {phaseLabel}
              </span>
            </span>
            {plan.phase === 'scheduled' && plan.timeRange && (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {PPC.LABELS.PHASE_INFO.STARTS_PREFIX} <TimeAgo date={plan.timeRange.startAt} />
                {plan.timeMode === 'time_range' && plan.timeRange.endAt && (
                  <>
                    {' · '}
                    {PPC.LABELS.PHASE_INFO.ENDS_PREFIX} <TimeAgo date={plan.timeRange.endAt} />
                  </>
                )}
              </span>
            )}
            {plan.phase === 'pending_approval' && plan.approval && (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {PPC.LABELS.PHASE_INFO.AWAITING_APPROVAL_PREFIX}{' '}
                <TimeAgo date={plan.approval.requestedAt} />
              </span>
            )}
            {plan.phase === 'active' && plan.health && <HealthBadge health={plan.health} />}
            {plan.phase === 'active' && plan.timeMode === 'time_range' && plan.timeRange?.endAt && (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                <TimeRemaining
                  date={plan.timeRange.endAt}
                  prefix={PPC.LABELS.PHASE_INFO.ENDS_IN_PREFIX}
                />
              </span>
            )}
            {plan.phase === 'terminated' && plan.terminatedAt && (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
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

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_DESCRIPTION}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 12,
              alignItems: 'start',
            }}
          >
            <ColumnShell title={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_COLUMN_PRIMARY}>
              <KeyValueGrid rows={overviewRows} />
            </ColumnShell>
            <ColumnShell title={PPC.LABELS.DETAIL_PAGE.SECTIONS.OVERVIEW_COLUMN_PARTICIPANTS}>
              {participants.length === 0 ? (
                <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {participants.map(({ id, user }) => (
                    <div key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <AvatarRing avatar={user?.avatar} username={user?.username ?? id} size={20} />
                      <span style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                        {user?.username ?? id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ColumnShell>
          </div>
        </SettingsCard>

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.SCOPE_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.SCOPE_DESCRIPTION}
        >
          <KeyValueGrid
            rows={[
              {
                k: 'scopeType',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.SCOPE_TYPE,
                value:
                  plan.scope.type === 'applications'
                    ? PPC.LABELS.DETAIL_PAGE.FIELDS.APPLICATIONS
                    : PPC.LABELS.DETAIL_PAGE.FIELDS.NAMESPACES,
              },
              {
                k: 'scopeItems',
                label:
                  plan.scope.type === 'applications'
                    ? PPC.LABELS.DETAIL_PAGE.FIELDS.APPLICATIONS
                    : PPC.LABELS.DETAIL_PAGE.FIELDS.NAMESPACES,
                value:
                  scopeItems.length === 0 ? (
                    EMPTY_VALUE
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {scopeItems.map((item) => (
                        <RowTag
                          key={item}
                          text={item.toLowerCase()}
                          fontSize={11}
                          capitalize={false}
                        />
                      ))}
                    </div>
                  ),
              },
              ...(excludedKinds.length > 0
                ? [
                    {
                      k: 'excludedKinds',
                      label: PPC.LABELS.DETAIL_PAGE.FIELDS.EXCLUDED_KINDS,
                      value: renderChips(
                        excludedKinds.map((kind) => ({ key: kind, text: kind.toLowerCase() })),
                      ),
                    },
                  ]
                : []),
              ...(excludedResources.length > 0
                ? [
                    {
                      k: 'excludedResources',
                      label: PPC.LABELS.DETAIL_PAGE.FIELDS.EXCLUDED_RESOURCES,
                      value: renderChips(
                        excludedResources.map((r) => ({
                          key: encodeResourceKey(r),
                          text: `${r.kind.toLowerCase()} \u00b7 ${r.name}`,
                        })),
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </SettingsCard>

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.POLICIES_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.POLICIES_DESCRIPTION}
        >
          {policies.length === 0 ? (
            <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {policies.map((p, idx) => (
                <div
                  key={`${p.templateID}-${idx}`}
                  style={{
                    border: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
                    borderRadius: 8,
                    padding: 10,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span
                    className={MONOSPACE_CLASS}
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                    }}
                  >
                    {p.templateID}
                  </span>
                  {p.params && Object.keys(p.params).length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 6,
                        justifyContent: 'flex-end',
                      }}
                    >
                      {Object.entries(p.params).map(([key, value]) => (
                        <RowTag
                          key={key}
                          text={`${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`}
                          fontSize={11}
                          capitalize={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SettingsCard>

        {plan.phase === 'active' && (
          <SettingsCard
            title={PPC.LABELS.DETAIL_PAGE.SECTIONS.HEALTH_TITLE}
            description={PPC.LABELS.DETAIL_PAGE.SECTIONS.HEALTH_DESCRIPTION}
            headerAction={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <HealthBadge health={health.status?.health ?? plan.health} />
                {plan.healthCheckedAt && (
                  <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                    {PPC.LABELS.HEALTH_DETAIL.CHECKED_AT}: <TimeAgo date={plan.healthCheckedAt} />
                  </span>
                )}
                <Tooltip title={PPC.LABELS.HEALTH_DETAIL.REFRESH_BUTTON}>
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
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
        )}

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_DESCRIPTION}
          headerAction={
            canViewViolations ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                    size="small"
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
            <ViolationsSection
              data={violations.data}
              loading={violations.loading}
              error={violations.error}
              mode={plan.mode}
            />
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
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.REPORTS_DESCRIPTION}
          headerAction={
            canViewReports ? (
              <Tooltip title={PPC.LABELS.REPORTS.REFRESH}>
                <Button
                  type="text"
                  shape="circle"
                  size="small"
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
              planName={plan.name}
              users={users}
              canDownload={canDownloadReport}
              onDownload={reports.download}
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
