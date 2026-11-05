import React from 'react';
import { Tooltip } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, SLIDE_OUT } from '../../../../../../constants';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';

// The protected-role marker: what it means is on hover and keyboard focus.
const LockedRoleIcon: React.FC = () => (
  <Tooltip title={ARC.TOOLTIPS.PROTECTED_ROLE} trigger={['hover', 'focus']}>
    <LockOutlined
      tabIndex={0}
      aria-label={ARC.LABELS.LOCKED_ROLE}
      className={SLIDE_OUT.HEADER_BUTTON_CLASS}
      style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED, flexShrink: 0 }}
    />
  </Tooltip>
);

export default LockedRoleIcon;
