import React, { memo, useMemo } from 'react';
import { Avatar } from 'antd';
import dayjs from 'dayjs';
import { DEFAULT_COLORS } from '../../../../constants';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PROTECTION_PLANS_POLICY_KEYS,
} from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';
import RowTag from '../../../../components/display/table/RowTag';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface ProtectionPlanCardProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan }) => {
  const enabledPolicies = plan.policies
    .filter((p) => p.enabled && PROTECTION_PLANS_POLICY_KEYS.includes(p.key))
    .map((p) => PPC.LABELS.POLICY_LABELS[p.key]);

  const lifecycleLabel = PPC.LABELS.LIFECYCLE_LABELS[plan.lifecycle];

  const windowText = `${dayjs(plan.schedule.startAt).format('MMM D, HH:mm')} → ${dayjs(
    plan.schedule.endAt,
  ).format('MMM D, HH:mm')}`;

  const participantsToShow = useMemo(() => plan.participants.slice(0, 4), [plan.participants]);
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
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: plan.description ? 8 : 10,
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
                marginTop: 2,
                marginBottom: 0,
                fontSize: 13,
                color: DEFAULT_COLORS.TEXT_MUTED,
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
          <RowTag
            text={lifecycleLabel}
            background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
            color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
            fontSize={12}
          />
          <RowTag
            text={plan.typeLabel}
            background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
            color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
            fontSize={12}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginLeft: 4,
              color: DEFAULT_COLORS.TEXT_MUTED,
              fontSize: 14,
            }}
          >
            <EyeOutlined />
            <EditOutlined />
            <DeleteOutlined />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
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
                <RowTag
                  key={label}
                  text={label}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                  fontSize={12}
                />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {participantsToShow.map((participant) => {
              const name = participant.displayName || '';
              const initials = name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join('');

              return (
                <Avatar
                  key={participant.id}
                  size={24}
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#0f172a',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {initials || '?'}
                </Avatar>
              );
            })}
            {extraParticipants > 0 && (
              <Avatar
                size={24}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#e5e7eb',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                +{extraParticipants}
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProtectionPlanCard.displayName = 'ProtectionPlanCard';

export default ProtectionPlanCard;
