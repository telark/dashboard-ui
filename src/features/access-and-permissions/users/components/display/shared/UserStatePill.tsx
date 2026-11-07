import React from 'react';
import { Tag } from 'antd';
import {
  DEFAULT_COLORS,
  STATUS_COLORS,
  TAG_CLASS,
  getPillColor,
} from '../../../../../../constants';
import type { UserAccountState } from '../../../models';

// White on the Active pill's green too (user decision, 2026-11-05).
const UserStatePill: React.FC<{ phase: UserAccountState }> = ({ phase }) => (
  <Tag
    color={getPillColor(STATUS_COLORS.USER_STATE[phase])}
    className={TAG_CLASS.MEDIUM}
    style={{ color: DEFAULT_COLORS.PILL_TEXT }}
  >
    {phase}
  </Tag>
);

export default UserStatePill;
