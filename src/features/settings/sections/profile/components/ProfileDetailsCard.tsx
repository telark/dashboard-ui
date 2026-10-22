import React, { memo, useCallback } from 'react';
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import {
  DEFAULT_COLORS,
  EMPTY_VALUE,
  STATUS_COLORS,
  TAG_CLASS,
  getPillColor,
  UNSTYLED_BUTTON,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import SettingsCard from '../../../components/SettingsCard';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type { User } from '../../../../access-and-permissions/users/models';

const { LABELS } = PROFILE_SECTION_CONSTANTS;

const iconStyle: React.CSSProperties = {
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: FONT_SIZE.LG,
};

const editButtonStyle: React.CSSProperties = {
  ...UNSTYLED_BUTTON,
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.S6,
  padding: `${SPACING.S6}px ${SPACING.MD}px`,
  borderRadius: RADIUS.SM,
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: FONT_SIZE.BASE,
  fontWeight: FONT_WEIGHT.MEDIUM,
  fontFamily: 'inherit',
};

const rowBaseStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: SPACING.SM,
  minHeight: 32,
  paddingTop: SPACING.NONE,
  paddingBottom: SPACING.NONE,
};

const profileRowLabelStyle: React.CSSProperties = {
  fontSize: FONT_SIZE.SM,
  fontWeight: FONT_WEIGHT.MEDIUM,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  flexShrink: 0,
  minWidth: 100,
};

// Off scale, kept exact: fontSize 15 (BASE to LG).
const valueCellStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  fontSize: 15,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  marginLeft: 'auto',
  textAlign: 'right',
};

export interface ProfileDetailsCardProps {
  user: User | null;
  onEditClick?: () => void;
}

const ProfileDetailsCard: React.FC<ProfileDetailsCardProps> = memo(({ user, onEditClick }) => {
  const handleEdit = useCallback(() => {
    onEditClick?.();
  }, [onEditClick]);

  const editButton = (
    <button type="button" onClick={handleEdit} style={editButtonStyle} title={LABELS.EDIT_TITLE}>
      <EditOutlined style={{ fontSize: FONT_SIZE.BASE }} />
      <span>{LABELS.EDIT}</span>
    </button>
  );

  return (
    <SettingsCard
      title={LABELS.PROFILE_DETAILS_CARD_TITLE}
      description={LABELS.PROFILE_DETAILS_CARD_DESCRIPTION}
      headerAction={onEditClick ? editButton : undefined}
    >
      <div style={rowBaseStyle}>
        <IdcardOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.FULL_NAME}</div>
        <div style={valueCellStyle}>{user?.fullname ?? EMPTY_VALUE}</div>
      </div>
      <div style={rowBaseStyle}>
        <UserOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.USERNAME}</div>
        <div style={valueCellStyle}>{user?.username ?? EMPTY_VALUE}</div>
      </div>
      <div style={rowBaseStyle}>
        <MailOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.EMAIL}</div>
        <div style={valueCellStyle}>{user?.email ?? EMPTY_VALUE}</div>
      </div>
      <div style={rowBaseStyle}>
        <CalendarOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.MEMBER_SINCE}</div>
        <div style={valueCellStyle}>
          {user?.creationDate ? <TimeAgo date={user.creationDate} /> : EMPTY_VALUE}
        </div>
      </div>
      <div style={rowBaseStyle}>
        <ClockCircleOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.LAST_LOGIN}</div>
        <div style={valueCellStyle}>
          {user?.status?.lastLoginAt ? <TimeAgo date={user.status.lastLoginAt} /> : EMPTY_VALUE}
        </div>
      </div>
      <div style={rowBaseStyle}>
        <CheckCircleOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.STATUS}</div>
        <div
          style={{
            ...valueCellStyle,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {user?.status?.phase ? (
            <Tag
              color={getPillColor(STATUS_COLORS.USER_STATE[user.status.phase])}
              className={TAG_CLASS.MEDIUM}
            >
              {user.status.phase}
            </Tag>
          ) : (
            <span
              style={{
                // Off scale, kept exact: fontSize 15 (BASE to LG).
                fontSize: 15,
                color: DEFAULT_COLORS.TEXT_MUTED,
              }}
            >
              {EMPTY_VALUE}
            </span>
          )}
        </div>
      </div>
    </SettingsCard>
  );
});

ProfileDetailsCard.displayName = 'ProfileDetailsCard';

export default ProfileDetailsCard;
