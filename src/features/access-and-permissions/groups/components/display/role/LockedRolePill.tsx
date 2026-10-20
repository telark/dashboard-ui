import React from 'react';
import { Tag, Tooltip } from 'antd';
import { TAG_CLASS } from '../../../../../../constants';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';

// The protected-role marker says what it is; the detail is on hover and keyboard focus.
const LockedRolePill: React.FC = () => (
  <Tooltip title={ARC.TOOLTIPS.PROTECTED_ROLE}>
    <Tag className={TAG_CLASS.AS_IS} tabIndex={0} style={{ flexShrink: 0 }}>
      {ARC.LABELS.LOCKED_ROLE}
    </Tag>
  </Tooltip>
);

export default LockedRolePill;
