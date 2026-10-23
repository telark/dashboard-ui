import React from 'react';
import { Tag } from 'antd';
import {
  CARD_LAYOUT,
  DEFAULT_COLORS,
  HEALTH_DOT_PX,
  getPillColor,
  SPACING,
} from '../../../constants';

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
  width: HEALTH_DOT_PX,
  height: HEALTH_DOT_PX,
  borderRadius: '50%',
  flexShrink: 0,
};

export interface HealthIndicatorProps {
  label: React.ReactNode;
  accent: string;
  loud: boolean;
}

// Only an abnormal state earns a filled pill; healthy and unknown stay a dot and muted text.
const HealthIndicator: React.FC<HealthIndicatorProps> = ({ label, accent, loud }) => {
  if (loud) {
    return <Tag color={getPillColor(accent)}>{label}</Tag>;
  }
  return (
    <span style={HEALTH_TEXT_STYLE}>
      <span aria-hidden style={{ ...HEALTH_DOT_STYLE, background: accent }} />
      {label}
    </span>
  );
};

export default HealthIndicator;
