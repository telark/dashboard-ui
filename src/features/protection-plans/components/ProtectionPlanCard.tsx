import React, { memo } from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { DEFAULT_COLORS } from '../../../constants';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PROTECTION_PLANS_POLICY_KEYS,
} from '../constants/protectionPlans';
import type { ProtectionPlan } from '../models';

interface ProtectionPlanCardProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan }) => {
  const enabledPolicies = plan.policies
    .filter((p) => p.enabled && PROTECTION_PLANS_POLICY_KEYS.includes(p.key))
    .map((p) => PPC.LABELS.POLICY_LABELS[p.key]);

  const lifecycleLabel = PPC.LABELS.LIFECYCLE_LABELS[plan.lifecycle];
  const isActive = plan.lifecycle === 'active';
  const isScheduled = plan.lifecycle === 'scheduled';
  const lifecycleBg = isActive ? '#22c55e30' : isScheduled ? '#0ea5e930' : '#e5e7eb80';
  const lifecycleColor = isActive ? '#16a34a' : isScheduled ? '#0369a1' : '#4b5563';

  const windowText = `${dayjs(plan.schedule.startAt).format('MMM D, HH:mm')} → ${dayjs(
    plan.schedule.endAt,
  ).format('MMM D, HH:mm')}`;

  const primaryParticipant = plan.participants[0]?.displayName ?? 'Unassigned';
  const extraParticipants = plan.participants.length - 1;

  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: 12,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
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
                margin: 4,
                marginLeft: 0,
                fontSize: 13,
                color: DEFAULT_COLORS.TEXT_MUTED,
              }}
            >
              {plan.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Tag
            style={{
              borderRadius: 999,
              border: 'none',
              background: lifecycleBg,
              color: lifecycleColor,
              fontWeight: 500,
            }}
          >
            {lifecycleLabel}
          </Tag>
          <Tag
            style={{
              borderRadius: 999,
              border: 'none',
              background: '#0ea5e930',
              color: '#0369a1',
              fontWeight: 500,
            }}
          >
            {plan.typeLabel}
          </Tag>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          fontSize: 13,
        }}
      >
        <div>
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
            {PPC.LABELS.COLUMNS.SCOPE}
          </div>
          <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {plan.scope.type === 'namespace' ? (
              <>
                Namespace <strong>{plan.scope.namespace}</strong>
                {plan.scope.cluster ? ` · ${plan.scope.cluster}` : ''}
              </>
            ) : (
              <>
                {plan.scope.kind} <strong>{plan.scope.name}</strong> · {plan.scope.namespace}
              </>
            )}
          </div>
        </div>

        <div>
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
            {PPC.LABELS.COLUMNS.WINDOW}
          </div>
          <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{windowText}</div>
        </div>

        <div>
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
            {PPC.LABELS.COLUMNS.POLICIES}
          </div>
          {enabledPolicies.length === 0 ? (
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>No policies enabled</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {enabledPolicies.slice(0, 3).map((label) => (
                <Tag
                  key={label}
                  style={{
                    borderRadius: 999,
                    border: 'none',
                    background: '#f1f5f9',
                    color: '#0f172a',
                  }}
                >
                  {label}
                </Tag>
              ))}
              {enabledPolicies.length > 3 && (
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
                  +{enabledPolicies.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div>
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, marginBottom: 4 }}>
            {PPC.LABELS.COLUMNS.PARTICIPANTS}
          </div>
          <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {primaryParticipant}
            {extraParticipants > 0 ? ` +${extraParticipants}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
});

ProtectionPlanCard.displayName = 'ProtectionPlanCard';

export default ProtectionPlanCard;

