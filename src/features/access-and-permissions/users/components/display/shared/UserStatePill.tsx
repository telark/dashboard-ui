import React from 'react';
import { Tag } from 'antd';
import { STATUS_COLORS, TAG_CLASS, getPillColor } from '../../../../../../constants';
import type { UserAccountState } from '../../../models';

const UserStatePill: React.FC<{ phase: UserAccountState }> = ({ phase }) => (
  <Tag color={getPillColor(STATUS_COLORS.USER_STATE[phase])} className={TAG_CLASS.MEDIUM}>
    {phase}
  </Tag>
);

export default UserStatePill;
