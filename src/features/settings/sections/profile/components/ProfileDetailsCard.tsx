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
import { DEFAULT_COLORS, EMPTY_VALUE } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../components/display/table/RowTag';
import SettingsCard from '../../../components/SettingsCard';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type { User } from '../../../../access-and-permissions/users/models';

const { LABELS } = PROFILE_SECTION_CONSTANTS;

const iconStyle: React.CSSProperties = {
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 16,
};

const editButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  border: 'none',
  borderRadius: 6,
  background: 'transparent',
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const rowBaseStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  minHeight: 32,
  paddingTop: 0,
  paddingBottom: 0,
};

const profileRowLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  flexShrink: 0,
  minWidth: 100,
};

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
      <EditOutlined style={{ fontSize: 14 }} />
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
            <RowTag
              text={user.status.phase}
              accent={user.status.phase === 'active' ? DEFAULT_COLORS.SUCCESS : undefined}
              fontSize={12}
            />
          ) : (
            <span style={{ fontSize: 15, color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>
          )}
        </div>
      </div>
    </SettingsCard>
  );
});

ProfileDetailsCard.displayName = 'ProfileDetailsCard';

export default ProfileDetailsCard;
