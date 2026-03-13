import React, { memo, useMemo } from 'react';
import { Avatar, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import type { ProtectionPlan } from '../../../models';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PROTECTION_PLANS_POLICY_KEYS,
  PROTECTION_PLAN_POLICY_SHORT_LABELS,
} from '../../../constants/protectionPlans';
import { getProtectionLevel, renderPolicyIcon } from '../../../utils';

interface ProtectionPlanCardRightProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCardRight: React.FC<ProtectionPlanCardRightProps> = memo(({ plan }) => {
  const enabledPolicies = plan.policies.filter(
    (p) => p.enabled && PROTECTION_PLANS_POLICY_KEYS.includes(p.key),
  );

  const participantsToShow = useMemo(() => plan.participants.slice(0, 5), [plan.participants]);
  const extraParticipants =
    plan.participants.length > participantsToShow.length
      ? plan.participants.length - participantsToShow.length
      : 0;

  const levelKey = getProtectionLevel(plan);
  const levelLabel = PPC.LABELS.PROTECTION_LEVELS[levelKey];
  const levelBackground =
    levelKey === 'high'
      ? DEFAULT_COLORS.DANGER
      : levelKey === 'medium'
        ? DEFAULT_COLORS.SUCCESS
        : DEFAULT_COLORS.TEXT_SECONDARY;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <div
          style={{
            color: DEFAULT_COLORS.TEXT_MUTED,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
          Protection Type
        </div>
        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: 600 }}>{plan.typeLabel}</div>
      </div>

      <div>
        <div
          style={{
            color: DEFAULT_COLORS.TEXT_MUTED,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
          Protection Level
        </div>
        <div>
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
        </div>
      </div>

      <div>
        <div
          style={{
            color: DEFAULT_COLORS.TEXT_MUTED,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
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
        <div
          style={{
            color: DEFAULT_COLORS.TEXT_MUTED,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
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
  );
});

ProtectionPlanCardRight.displayName = 'ProtectionPlanCardRight';

export default ProtectionPlanCardRight;
