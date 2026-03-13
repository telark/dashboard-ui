import React, { memo, useMemo } from 'react';
import { Avatar, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import type { ProtectionPlan } from '../../../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../../constants/protectionPlans';
import { getProtectionLevel } from '../../../utils';
import dayjs from 'dayjs';
import FieldLabel from '../../shared/FieldLabel';

interface ProtectionPlanCardRightProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCardRight: React.FC<ProtectionPlanCardRightProps> = memo(({ plan }) => {
  const startAt = dayjs(plan.schedule.startAt);
  const endAt = dayjs(plan.schedule.endAt);
  const remainingText = (() => {
    const totalMinutesRemaining = endAt.diff(dayjs(), 'minute');
    if (totalMinutesRemaining <= 0) return null;
    const hours = Math.floor(totalMinutesRemaining / 60);
    const minutes = totalMinutesRemaining % 60;
    if (hours === 0) return `Ends in ${minutes}m`;
    if (minutes === 0) return `Ends in ${hours}h`;
    return `Ends in ${hours}h ${minutes}m`;
  })();

  const owner = useMemo(
    () => plan.participants.find((participant) => participant.id === plan.ownerId),
    [plan.ownerId, plan.participants],
  );

  const nonOwnerParticipants = useMemo(
    () => plan.participants.filter((participant) => participant.id !== plan.ownerId),
    [plan.ownerId, plan.participants],
  );

  const participantsToShow = useMemo(
    () => nonOwnerParticipants.slice(0, 5),
    [nonOwnerParticipants],
  );

  const extraParticipants =
    nonOwnerParticipants.length > participantsToShow.length
      ? nonOwnerParticipants.length - participantsToShow.length
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
        <FieldLabel>{PPC.LABELS.CARD.PROTECTION_TYPE}</FieldLabel>
        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: 600 }}>{plan.typeLabel}</div>
      </div>

      <div>
        <FieldLabel>{PPC.LABELS.CARD.PROTECTION_LEVEL}</FieldLabel>
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
        <FieldLabel>{PPC.LABELS.COLUMNS.WINDOW}</FieldLabel>
        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
          {startAt.format('MMM D HH:mm')} → {endAt.format('MMM D HH:mm')}
          {remainingText && (
            <span
              style={{
                marginLeft: 6,
                fontSize: 12,
                color: DEFAULT_COLORS.TEXT_MUTED,
              }}
            >
              ({remainingText})
            </span>
          )}
        </div>
      </div>

      {owner && (
        <div>
          <FieldLabel>{PPC.LABELS.CARD.OWNER}</FieldLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {(() => {
              const name = owner.displayName || '';
              const initials = name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join('');

              return (
                <Avatar
                  size={26}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#e5e7eb',
                    fontSize: 12,
                    fontWeight: 600,
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 0 1px rgba(15,23,42,0.08)',
                  }}
                >
                  {initials || '?'}
                </Avatar>
              );
            })()}
          </div>
        </div>
      )}

      <div>
        <FieldLabel>{PPC.LABELS.CARD.PARTICIPANTS}</FieldLabel>
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
