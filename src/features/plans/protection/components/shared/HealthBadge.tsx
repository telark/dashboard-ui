import React from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import {
  HEALTH_DOT_COLOR,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import type { PlanHealth } from '../../models';

interface HealthBadgeProps {
  health?: PlanHealth;
  compact?: boolean;
}

const HealthBadge: React.FC<HealthBadgeProps> = ({ health, compact }) => {
  if (!health) return null;
  const color = HEALTH_DOT_COLOR[health];
  const label = PPC.LABELS.HEALTH_LABELS[health];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 0 3px ${DEFAULT_COLORS.CHIP_CUSTOM_BG}`,
          flexShrink: 0,
        }}
      />
      {!compact && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_MUTED,
            lineHeight: 1.2,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
};

export default HealthBadge;
