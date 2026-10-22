import React from 'react';
import {
  DEFAULT_COLORS,
  STATUS_COLORS,
  STATUS_DOT,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
} from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanHealth } from '../../models';

interface HealthBadgeProps {
  health?: PlanHealth;
  compact?: boolean;
}

const HealthBadge: React.FC<HealthBadgeProps> = ({ health, compact }) => {
  if (!health) return null;
  const color = STATUS_COLORS.PLAN_HEALTH[health];
  const label = PPC.LABELS.HEALTH_LABELS[health];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.S6 }}>
      <span
        aria-hidden
        style={{
          ...STATUS_DOT,
          background: color,
          boxShadow: `0 0 0 3px ${DEFAULT_COLORS.CHIP_CUSTOM_BG}`,
        }}
      />
      {!compact && (
        <span
          style={{
            fontSize: FONT_SIZE.SM,
            fontWeight: FONT_WEIGHT.SEMIBOLD,
            color: DEFAULT_COLORS.TEXT_MUTED,
            lineHeight: LINE_HEIGHT.TIGHT,
          }}
        >
          {label}
        </span>
      )}
    </span>
  );
};

export default HealthBadge;
