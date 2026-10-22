import React from 'react';
import { Tag } from 'antd';
import {
  ClockCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { DEFAULT_COLORS, STATUS_COLORS, TAG_CLASS, withAlpha } from '../../../../constants';
import type { ApplicationProtection } from '../../models';
import { APPLICATION_CARD } from '../../constants';

// A shape per state, so protection reads apart from the health pill beside it.
export const PROTECTION_ICONS: Record<ApplicationProtection, React.ReactNode> = {
  enforcing: <SafetyCertificateOutlined />,
  auditing: <EyeOutlined />,
  upcoming: <ClockCircleOutlined />,
  none: <WarningOutlined />,
};

// Every state is an outline in its own tone, since solid fills belong to the health pills.
// The risk is the app's one tinted warning (user, 2026-10-20).
const STATE_STYLE: Partial<Record<ApplicationProtection, React.CSSProperties>> = {
  none: {
    background: DEFAULT_COLORS.WARNING_TINT,
    borderColor: withAlpha(DEFAULT_COLORS.WARNING, 0.5),
  },
};

const ProtectionBadge: React.FC<{ protection: ApplicationProtection }> = ({ protection }) => (
  <Tag
    className={`${TAG_CLASS.ICON} ${TAG_CLASS.OUTLINE}`}
    style={{
      flexShrink: 0,
      color: STATUS_COLORS.APPLICATION_COVERAGE[protection],
      ...STATE_STYLE[protection],
    }}
  >
    {PROTECTION_ICONS[protection]}
    <span>{APPLICATION_CARD.COVERAGE.BADGE[protection]}</span>
  </Tag>
);

export default ProtectionBadge;
