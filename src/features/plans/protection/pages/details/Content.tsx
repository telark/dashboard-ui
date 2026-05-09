import React, { memo, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { Button, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import KeyValueGrid from '../../../../resources/applications/components/details/KeyValueGrid';
import RowTag from '../../../../../components/display/table/RowTag';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import TimeRemaining from '../../../../../components/display/time/TimeRemaining';
import UserAvatar from '../../../../../components/display/avatars/UserAvatar';
import type { UserAvatar as UserAvatarModel } from '../../../../access-and-permissions/users/models';

const AVATAR_RING_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 1.5,
  border: '1.5px solid #20C997',
  borderRadius: '50%',
  background: '#fff',
  boxSizing: 'border-box',
  flexShrink: 0,
};

const AVATAR_INNER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  fontWeight: 600,
};

const AvatarRing: React.FC<{
  avatar?: UserAvatarModel;
  username?: string;
  size: number;
}> = ({ avatar, username, size }) => (
  <span style={AVATAR_RING_STYLE}>
    <UserAvatar avatar={avatar} username={username} size={size} style={AVATAR_INNER_STYLE} />
  </span>
);
import { ColumnShell } from '../../../../resources/applications/pages/details/contentBlocks';
import HealthBadge from '../../components/shared/HealthBadge';
import HealthSection from '../../components/details/HealthSection';
import ViolationsSection from '../../components/details/ViolationsSection';
import ProtectionPlanDetailsToolbar from '../../components/layout/ProtectionPlanDetailsToolbar';
import { usePlanHealth } from '../../hooks/usePlanHealth';
import { usePlanViolations } from '../../hooks/usePlanViolations';
import type { ViolationsResultFilter } from '../../hooks/usePlanViolations';
import { Select } from 'antd';
import type { RootState } from '../../../../../store';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PHASE_DOT_COLOR,
} from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';

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
  cancelling: boolean;
  refreshingHealth: boolean;
  onDuplicate: () => void;
  onCancel: () => void;
  onRefreshHealth: () => void;
}

const EMPTY = PPC.LABELS.DETAIL_PAGE.EMPTY_VALUE;

const ProtectionPlanDetailsContent: React.FC<ProtectionPlanDetailsContentProps> = memo(
  ({ plan, duplicating, cancelling, refreshingHealth, onDuplicate, onCancel, onRefreshHealth }) => {
    const phaseLabel = PPC.LABELS.PHASE_LABELS[plan.phase] ?? plan.phase;
    const dotColor = PHASE_DOT_COLOR[plan.phase] ?? PHASE_DOT_COLOR.draft;
    const health = usePlanHealth(plan.id);
    const violations = usePlanViolations(plan.id);
    const violationsFilterOptions: Array<{ value: ViolationsResultFilter; label: string }> = [
      { value: 'all', label: PPC.LABELS.VIOLATIONS.FILTER_ALL },
      { value: 'fail', label: PPC.LABELS.VIOLATION_RESULT_LABELS.fail },
      { value: 'pass', label: PPC.LABELS.VIOLATION_RESULT_LABELS.pass },
      { value: 'warn', label: PPC.LABELS.VIOLATION_RESULT_LABELS.warn },
      { value: 'error', label: PPC.LABELS.VIOLATION_RESULT_LABELS.error },
      { value: 'skip', label: PPC.LABELS.VIOLATION_RESULT_LABELS.skip },
    ];
    const users = useSelector((s: RootState) => s.users.users);
    const participants = useMemo(() => {
      const ids = plan.participantsIDs ?? [];
      return ids.map((id) => {
        const user = users.find((u) => u.id === id);
        return { id, user };
      });
    }, [plan.participantsIDs, users]);

    const renderUserAndTime = useCallback(
      (userId: string | undefined, when: string | undefined): React.ReactNode => {
        const user = userId ? users.find((u) => u.id === userId) : undefined;
        const display = user?.username ?? userId;
        const timeNode = when ? <TimeAgo date={when} /> : EMPTY;
        if (!userId) return timeNode;
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <AvatarRing avatar={user?.avatar} username={display ?? userId} size={20} />
              <span style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY }}>{display}</span>
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
      [users],
    );

    const overviewRows = useMemo(
      () => [
        { k: 'name', label: PPC.LABELS.DETAIL_PAGE.FIELDS.NAME, value: plan.name },
        {
          k: 'description',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.DESCRIPTION,
          value: plan.description || EMPTY,
        },
        {
          k: 'severity',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.SEVERITY,
          value: plan.severity || EMPTY,
        },
        {
          k: 'priority',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.PRIORITY,
          value: plan.priority ?? EMPTY,
        },
        { k: 'mode', label: PPC.LABELS.DETAIL_PAGE.FIELDS.MODE, value: plan.mode },
        {
          k: 'timeMode',
          label: PPC.LABELS.DETAIL_PAGE.FIELDS.TIME_MODE,
          value:
            plan.timeMode === 'time_range' && plan.timeRange ? (
              <span>
                {dayjs(plan.timeRange.startAt).format('MMM D, YYYY h:mm A')} →{' '}
                {dayjs(plan.timeRange.endAt).format('MMM D, YYYY h:mm A')}
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
        ...(plan.reason && (plan.phase === 'failed' || plan.phase === 'cancelled')
          ? [
              {
                k: 'reason',
                label: PPC.LABELS.DETAIL_PAGE.FIELDS.REASON,
                value: plan.reason,
              },
            ]
          : []),
      ],
      [plan, users, renderUserAndTime],
    );

    const scopeItems =
      plan.scope.type === 'applications' ? plan.scope.applicationIds : plan.scope.namespaces;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            position: 'sticky',
            top: HEADER_LAYOUT.HEIGHT_PX,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '8px 0',
            background: DEFAULT_COLORS.BACKGROUND_WHITE,
            borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
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
            {plan.phase === 'active' && plan.health && <HealthBadge health={plan.health} />}
            {plan.phase === 'active' && plan.timeMode === 'time_range' && plan.timeRange?.endAt && (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {PPC.LABELS.PHASE_INFO.ENDS_IN_PREFIX} <TimeRemaining date={plan.timeRange.endAt} />
              </span>
            )}
            {plan.phase === 'terminated' && plan.terminatedAt && (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {PPC.LABELS.PHASE_INFO.TERMINATED_PREFIX} <TimeAgo date={plan.terminatedAt} />
              </span>
            )}
          </div>
          <ProtectionPlanDetailsToolbar
            phase={plan.phase}
            duplicating={duplicating}
            cancelling={cancelling}
            refreshingHealth={refreshingHealth}
            onDuplicate={onDuplicate}
            onCancel={onCancel}
            onRefreshHealth={onRefreshHealth}
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
                <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY}</div>
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
                    EMPTY
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {scopeItems.map((item) => (
                        <RowTag
                          key={item}
                          text={item.toLowerCase()}
                          background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                          color={DEFAULT_COLORS.TEXT_MUTED}
                          fontSize={11}
                          capitalize={false}
                        />
                      ))}
                    </div>
                  ),
              },
            ]}
          />
        </SettingsCard>

        <SettingsCard
          title={PPC.LABELS.DETAIL_PAGE.SECTIONS.POLICIES_TITLE}
          description={PPC.LABELS.DETAIL_PAGE.SECTIONS.POLICIES_DESCRIPTION}
        >
          {plan.policies.length === 0 ? (
            <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plan.policies.map((p, idx) => (
                <div
                  key={`${p.templateID}-${idx}`}
                  style={{
                    border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
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
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                      fontFamily: 'monospace',
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
                          background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                          color={DEFAULT_COLORS.TEXT_SECONDARY}
                          fontSize={11}
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
          }
        >
          <ViolationsSection
            data={violations.data}
            loading={violations.loading}
            error={violations.error}
            mode={plan.mode}
          />
        </SettingsCard>
      </div>
    );
  },
);

ProtectionPlanDetailsContent.displayName = 'ProtectionPlanDetailsContent';

export default ProtectionPlanDetailsContent;
