import React from 'react';
import { Tag } from 'antd';
import {
  CARD_LAYOUT,
  DEFAULT_COLORS,
  STATUS_COLORS,
  getPillColor,
  SPACING,
} from '../../../../constants';
import { APPLICATION_CARD, APPLICATIONS_UI } from '../../constants';

const HEALTH_TEXT_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: SPACING.S6,
  fontSize: CARD_LAYOUT.VALUE_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
};

const HEALTH_DOT_STYLE: React.CSSProperties = {
  width: APPLICATION_CARD.HEALTH_DOT_PX,
  height: APPLICATION_CARD.HEALTH_DOT_PX,
  borderRadius: '50%',
  flexShrink: 0,
};

// Only an abnormal state earns a filled pill; healthy and unknown stay a dot and muted text.
const ApplicationHealthIndicator: React.FC<{ status?: string }> = ({ status }) => {
  const key = (status || APPLICATIONS_UI.FALLBACKS.UNKNOWN).toLowerCase();
  const accent = STATUS_COLORS.APPLICATION_HEALTH[key] ?? DEFAULT_COLORS.NEUTRAL;
  const label = APPLICATION_CARD.HEALTH_LABELS[key] ?? status;

  if (APPLICATION_CARD.LOUD_HEALTH.includes(key)) {
    return <Tag color={getPillColor(accent)}>{label}</Tag>;
  }
  return (
    <span style={HEALTH_TEXT_STYLE}>
      <span aria-hidden style={{ ...HEALTH_DOT_STYLE, background: accent }} />
      {label}
    </span>
  );
};

export default ApplicationHealthIndicator;
