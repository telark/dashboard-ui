import React from 'react';
import { Segmented, Tooltip } from 'antd';
import { FONT_WEIGHT, HAIRLINE, Icons, SPACING, VIEW } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';

export type RoleSource = 'direct' | 'groups';

const { VIEW: VIEW_TEXTS, MANAGE_ROLE } = UC.LABELS.PANELS;
const ICON_SIZE = 15;
const UserIcon = Icons.User;
const GroupIcon = Icons.Group;

const TRACK_STYLE: React.CSSProperties = { border: HAIRLINE.SURFACE_BORDER };

interface OptionLabelProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
  tooltip: string;
}

const OptionLabel: React.FC<OptionLabelProps> = ({ active, icon, label, count, tooltip }) => (
  <Tooltip title={tooltip} placement="bottom">
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.SM,
        fontWeight: active ? FONT_WEIGHT.SEMIBOLD : FONT_WEIGHT.MEDIUM,
      }}
    >
      {icon}
      {label}
      <span
        style={{
          ...VIEW.TAB_COUNT,
          ...(active ? VIEW.TAB_COUNT_ACTIVE : undefined),
          marginLeft: SPACING.NONE,
        }}
      >
        {count}
      </span>
    </span>
  </Tooltip>
);

interface RoleSourceSwitchProps {
  value: RoleSource;
  onChange: (value: RoleSource) => void;
  directCount: number;
  groupsCount: number;
}

// Where a member's listed roles come from. The look lives in SEGMENTED_THEME (PANEL_THEME).
const RoleSourceSwitch: React.FC<RoleSourceSwitchProps> = ({
  value,
  onChange,
  directCount,
  groupsCount,
}) => (
  <Segmented<RoleSource>
    block
    aria-label={VIEW_TEXTS.ROLE_SOURCE_LABEL}
    style={TRACK_STYLE}
    value={value}
    onChange={onChange}
    options={[
      {
        value: 'direct',
        label: (
          <OptionLabel
            active={value === 'direct'}
            icon={<UserIcon size={ICON_SIZE} />}
            label={VIEW_TEXTS.DIRECT_ROLES_BUTTON}
            count={directCount}
            tooltip={VIEW_TEXTS.DIRECT_ROLES_TOOLTIP}
          />
        ),
      },
      {
        value: 'groups',
        label: (
          <OptionLabel
            active={value === 'groups'}
            icon={<GroupIcon size={ICON_SIZE} />}
            label={MANAGE_ROLE.FROM_GROUPS_BUTTON}
            count={groupsCount}
            tooltip={MANAGE_ROLE.FROM_GROUPS_TOOLTIP}
          />
        ),
      },
    ]}
  />
);

export default RoleSourceSwitch;
