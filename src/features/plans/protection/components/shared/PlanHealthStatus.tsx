import React from 'react';
import { SPACING, STATUS_COLORS, UNSTYLED_BUTTON } from '../../../../../constants';
import { HealthIndicator } from '../../../../../components/display/details';
import {
  PLAN_LOUD_HEALTH,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import type { PlanHealth } from '../../models';

// A text button that keeps the browser's focus ring (no `all: unset`), wrapping in a narrow column.
const JUMP_STYLE: React.CSSProperties = {
  ...UNSTYLED_BUTTON,
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: SPACING.S6,
  rowGap: SPACING.XXS,
  font: 'inherit',
  color: 'inherit',
  textAlign: 'left',
};

interface PlanHealthStatusProps {
  health: PlanHealth;
  // Protections not in force: with a count above 0 the status becomes the jump to Health.
  notInForce?: number;
  onJump?: () => void;
}

// A running plan's health, like the card's, and the way to the Health card when protections fail.
const PlanHealthStatus: React.FC<PlanHealthStatusProps> = ({ health, notInForce = 0, onJump }) => {
  const indicator = (
    <HealthIndicator
      label={PPC.LABELS.HEALTH_LABELS[health]}
      accent={STATUS_COLORS.PLAN_HEALTH[health]}
      loud={PLAN_LOUD_HEALTH.includes(health)}
    />
  );
  if (notInForce === 0 || !onJump) return indicator;
  return (
    <button type="button" onClick={onJump} style={JUMP_STYLE}>
      {indicator}
      {PPC.LABELS.CARD.META_SEPARATOR}
      {/* 3: the underline clears the descenders, between the XXS and XS steps. */}
      <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
        {PPC.LABELS.HEALTH_DETAIL.STATUS_NOT_IN_FORCE(notInForce)}
      </span>
    </button>
  );
};

export default PlanHealthStatus;
