import React from 'react';
import { Tag } from 'antd';
import {
  ClockCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { STATUS_COLORS, TAG_CLASS, getPillColor } from '../../../../constants';
import type { ApplicationProtection } from '../../models';
import { APPLICATION_CARD } from '../../constants';

// A shape per state, so protection reads apart from the health pill beside it.
export const PROTECTION_ICONS: Record<ApplicationProtection, React.ReactNode> = {
  enforcing: <SafetyCertificateOutlined />,
  auditing: <EyeOutlined />,
  upcoming: <ClockCircleOutlined />,
  none: <WarningOutlined />,
};

const ProtectionBadge: React.FC<{ protection: ApplicationProtection }> = ({ protection }) => (
  <Tag
    color={getPillColor(STATUS_COLORS.APPLICATION_COVERAGE[protection])}
    className={TAG_CLASS.ICON}
    style={{ flexShrink: 0 }}
  >
    {PROTECTION_ICONS[protection]}
    <span>{APPLICATION_CARD.COVERAGE.BADGE[protection]}</span>
  </Tag>
);

export default ProtectionBadge;
