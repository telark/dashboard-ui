import React from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { SPACING, FONT_SIZE, KEYBOARD_TOOLTIP_TRIGGER } from '../../../constants';

// A label whose meaning is not obvious, explained behind a focusable info icon.
const LabelWithInfo: React.FC<{ label: string; info: string }> = ({ label, info }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.XS }}>
    {label}
    <Tooltip title={info} trigger={KEYBOARD_TOOLTIP_TRIGGER}>
      <InfoCircleOutlined tabIndex={0} aria-label={info} style={{ fontSize: FONT_SIZE.XS }} />
    </Tooltip>
  </span>
);

export default LabelWithInfo;
