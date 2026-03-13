import React, { memo, useMemo } from 'react';
import { Avatar, Button, Dropdown, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { DEFAULT_COLORS } from '../../../../constants';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PROTECTION_PLANS_POLICY_KEYS,
  PROTECTION_PLAN_POLICY_SHORT_LABELS,
} from '../../constants/protectionPlans';
import type { ProtectionPlan, ProtectionPlanPolicyKey } from '../../models';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  StopOutlined,
  PlayCircleOutlined,
  MoreOutlined,
  LockOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
} from '@ant-design/icons';

interface ProtectionPlanCardProps {
  plan: ProtectionPlan;
}

const formatRemainingTime = (
  endIso: string,
  lifecycle: ProtectionPlan['lifecycle'],
): string | null => {
  if (lifecycle !== 'active') return null;
  const end = dayjs(endIso);
  const now = dayjs();
  if (!end.isAfter(now)) return null;

  const totalMinutes = end.diff(now, 'minute');
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0 && minutes <= 0) return null;
  if (hours === 0) return `Ends in ${minutes}m`;
  if (minutes === 0) return `Ends in ${hours}h`;
  return `Ends in ${hours}h ${minutes}m`;
};

const getProtectionLevel = (plan: ProtectionPlan): keyof typeof PPC.LABELS.PROTECTION_LEVELS => {
  const hasUpdateBlock = plan.policies.some((p) => p.enabled && p.key === 'preventWorkloadUpdates');
  const hasDeleteBlock = plan.policies.some(
    (p) => p.enabled && p.key === 'preventResourceDeletion',
  );
  const hasConfigFreeze = plan.policies.some((p) => p.enabled && p.key === 'configurationFreeze');

  if (hasUpdateBlock && hasDeleteBlock) return 'high';
  if (hasUpdateBlock || hasDeleteBlock) return 'medium';
  if (hasConfigFreeze) return 'low';
  return 'low';
};

const renderPolicyIcon = (key: ProtectionPlanPolicyKey) => {
  switch (key) {
    case 'preventWorkloadUpdates':
      return <LockOutlined />;
    case 'preventResourceDeletion':
      return <DeleteOutlined />;
    case 'configurationFreeze':
      return <SettingOutlined />;
    case 'versionRestriction':
      return <ClockCircleOutlined />;
    case 'rollbackPrevention':
      return <RollbackOutlined />;
    default:
      return null;
  }
};

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan }) => {
  const enabledPolicies = plan.policies.filter(
    (p) => p.enabled && PROTECTION_PLANS_POLICY_KEYS.includes(p.key),
  );

  const lifecycleLabel = PPC.LABELS.LIFECYCLE_LABELS[plan.lifecycle];

  const startAt = dayjs(plan.schedule.startAt);
  const endAt = dayjs(plan.schedule.endAt);
  const remainingText = formatRemainingTime(plan.schedule.endAt, plan.lifecycle);

  const participantsToShow = useMemo(() => plan.participants.slice(0, 5), [plan.participants]);
  const extraParticipants =
    plan.participants.length > participantsToShow.length
      ? plan.participants.length - participantsToShow.length
      : 0;

  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: 10,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        padding: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: plan.description ? 12 : 16,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
            }}
          >
            {plan.name}
          </h3>
          {plan.description && (
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 400,
                color: DEFAULT_COLORS.TEXT_MUTED,
                lineHeight: 1.2,
                fontFamily: "'Roboto Condensed', sans-serif",
              }}
            >
              {plan.description}
            </p>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              background:
                plan.lifecycle === 'active'
                  ? DEFAULT_COLORS.SUCCESS
                  : DEFAULT_COLORS.TEXT_MUTED,
              color: '#ffffff',
            }}
          >
            {lifecycleLabel}
          </span>
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            menu={{
              items: [
                {
                  key: 'view',
                  label: PPC.LABELS.ACTIONS.VIEW,
                  icon: <EyeOutlined />,
                },
                {
                  key: 'edit',
                  label: PPC.LABELS.ACTIONS.EDIT,
                  icon: <EditOutlined />,
                },
                {
                  key: 'duplicate',
                  label: 'Duplicate plan',
                  icon: <CopyOutlined />,
                },
                ...(plan.lifecycle === 'active'
                  ? [
                      {
                        key: 'cancel',
                        label: 'Cancel plan',
                        icon: <StopOutlined />,
                      },
                    ]
                  : []),
                ...(plan.lifecycle === 'scheduled'
                  ? [
                      {
                        key: 'activate',
                        label: 'Activate plan',
                        icon: <PlayCircleOutlined />,
                      },
                    ]
                  : []),
                {
                  type: 'divider',
                },
                {
                  key: 'delete',
                  label: PPC.LABELS.ACTIONS.DELETE,
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
            }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined rotate={90} />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Dropdown>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.5fr)',
          columnGap: 24,
          rowGap: 12,
          fontSize: 13,
          paddingTop: 10,
          borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 2 }}>Protected Scope</div>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div>
                  <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, minWidth: 80 }}>
                    Cluster
                  </span>
                  <span style={{ marginLeft: 8, fontWeight: 600 }}>
                    {plan.scope.cluster ?? '—'}
                  </span>
                </div>
                <div>
                  <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, minWidth: 80 }}>
                    Namespace
                  </span>
                  <span style={{ marginLeft: 8, fontWeight: 600 }}>{plan.scope.namespace}</span>
                </div>
                {plan.scope.type === 'workload' && (
                  <div>
                    <span
                      style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, minWidth: 80 }}
                    >
                      Resource
                    </span>
                    <span style={{ marginLeft: 8, fontWeight: 600 }}>
                      {plan.scope.name} {plan.scope.kind.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>
              {plan.scope.workloadsCount != null && plan.scope.workloadsCount > 0 && (
                <div style={{ marginTop: 6, fontSize: 12 }}>
                  <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>Protected workloads: </span>
                  <span style={{ fontWeight: 600, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                    {plan.scope.workloadsCount}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 2 }}>
              {PPC.LABELS.COLUMNS.WINDOW}
            </div>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              {startAt.format('MMM D HH:mm')} → {endAt.format('MMM D HH:mm')}
            </div>
            {remainingText && (
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, marginTop: 2 }}>
                {remainingText}
              </div>
            )}
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, marginTop: 2 }}>
              Duration:{' '}
              {(() => {
                const totalMinutes = endAt.diff(startAt, 'minute');
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                if (hours === 0) return `${minutes}m`;
                if (minutes === 0) return `${hours}h`;
                return `${hours}h ${minutes}m`;
              })()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>Protection Type</div>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: 600 }}>
              {plan.typeLabel}
            </div>
          </div>

          <div>
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 2 }}>Protection Level</div>
            <div>
              {(() => {
                const levelKey = getProtectionLevel(plan);
                const levelLabel = PPC.LABELS.PROTECTION_LEVELS[levelKey];
                const levelBackground =
                  levelKey === 'high'
                    ? DEFAULT_COLORS.DANGER
                    : levelKey === 'medium'
                    ? DEFAULT_COLORS.SUCCESS
                    : DEFAULT_COLORS.TEXT_SECONDARY;
                return (
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      background: levelBackground,
                      color: '#ffffff',
                    }}
                  >
                    {levelLabel}
                  </span>
                );
              })()}
            </div>
          </div>

          <div>
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 2 }}>
              {PPC.LABELS.COLUMNS.POLICIES}
            </div>
            {enabledPolicies.length === 0 ? (
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>No policies enabled</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {enabledPolicies.slice(0, 3).map((policy) => (
                  <span
                    key={policy.key}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
                      color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    <span>{renderPolicyIcon(policy.key)}</span>
                    <span>{PROTECTION_PLAN_POLICY_SHORT_LABELS[policy.key]}</span>
                  </span>
                ))}
                {enabledPolicies.length > 3 && (
                  <Tooltip
                    title={
                      <div style={{ maxWidth: 260 }}>
                        {enabledPolicies.map((policy) => (
                          <div key={policy.key} style={{ fontSize: 12, marginBottom: 2 }}>
                            {PPC.LABELS.POLICY_LABELS[policy.key]}
                          </div>
                        ))}
                      </div>
                    }
                  >
                    <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
                      +{enabledPolicies.length - 3} more
                    </span>
                  </Tooltip>
                )}
              </div>
            )}
          </div>

          <div>
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 2 }}>
              {PPC.LABELS.COLUMNS.PARTICIPANTS}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {participantsToShow.map((participant, index) => {
                const name = participant.displayName || '';
                const initials = name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part.charAt(0).toUpperCase())
                  .join('');

                return (
                  <Tooltip key={participant.id} title={name} placement="top">
                    <Avatar
                      size={26}
                      style={{
                        backgroundColor: '#e2e8f0',
                        color: '#0f172a',
                        fontSize: 12,
                        fontWeight: 500,
                        border: '2px solid #ffffff',
                        boxShadow: '0 0 0 1px rgba(15,23,42,0.05)',
                        marginLeft: index === 0 ? 0 : -8,
                      }}
                    >
                      {initials || '?'}
                    </Avatar>
                  </Tooltip>
                );
              })}
              {extraParticipants > 0 && (
                <Avatar
                  size={26}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#e5e7eb',
                    fontSize: 12,
                    fontWeight: 600,
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 0 1px rgba(15,23,42,0.05)',
                    marginLeft: participantsToShow.length ? -8 : 0,
                  }}
                >
                  +{extraParticipants}
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProtectionPlanCard.displayName = 'ProtectionPlanCard';

export default ProtectionPlanCard;
