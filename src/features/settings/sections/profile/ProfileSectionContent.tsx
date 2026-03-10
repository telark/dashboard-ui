import React, { memo, useCallback, useState, useEffect } from 'react';
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { DEFAULT_COLORS, HEADER_CONSTANTS } from '../../../../constants';
import UserAvatar from '../../../../components/display/avatars/UserAvatar';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import RowTag from '../../../../components/display/table/RowTag';
import { getCurrentUser } from '../../../auth/utils';
import { fetchCurrentUserDetails } from '../../../access-and-permissions/users/utils';
import type { User } from '../../../access-and-permissions/users/models';
import { PROFILE_SECTION_CONSTANTS } from './constants';

const { LAYOUT, LABELS } = PROFILE_SECTION_CONSTANTS;
const AVATAR_BORDER = HEADER_CONSTANTS.USER.AVATAR.BORDER_WIDTH;

const iconStyle = { color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 16 };

const getRowBase = (borderTop = true) =>
  ({
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: 8,
    borderTop: borderTop ? `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}` : 'none',
    minHeight: 32,
    paddingTop: 0,
    paddingBottom: 0,
  }) as const;

const profileRowLabelStyle = {
  fontSize: 12 as const,
  fontWeight: 500 as const,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em' as const,
  flexShrink: 0 as const,
  minWidth: 100,
} as const;

const valueCellStyle = {
  flex: 1,
  minWidth: 0,
  fontSize: 15,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  marginLeft: 'auto' as const,
  textAlign: 'right' as const,
} as const;

const ProfileSectionContent: React.FC = memo(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const handleEditProfile = useCallback(() => {}, []);

  useEffect(() => {
    const initial = getCurrentUser();
    if (initial?.id) {
      fetchCurrentUserDetails((user) => setCurrentUser(user));
    }
  }, []);

  const avatarWrapperSize = LAYOUT.AVATAR_SIZE + AVATAR_BORDER * 2;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: LAYOUT.ROW_GAP,
        fontSize: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: avatarWrapperSize,
            height: avatarWrapperSize,
            flexShrink: 0,
            borderRadius: '50%',
            border: `${AVATAR_BORDER}px solid ${DEFAULT_COLORS.SUCCESS}`,
            padding: AVATAR_BORDER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          {currentUser ? (
            <UserAvatar
              avatar={currentUser.avatar}
              username={currentUser.username}
              size={LAYOUT.AVATAR_SIZE}
              style={{ border: 'none' }}
            />
          ) : (
            <div
              style={{
                width: LAYOUT.AVATAR_SIZE,
                height: LAYOUT.AVATAR_SIZE,
                borderRadius: '50%',
                background: DEFAULT_COLORS.BACKGROUND_HOVER,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 600,
                color: DEFAULT_COLORS.TEXT_MUTED,
              }}
            >
              {LABELS.PLACEHOLDER}
            </div>
          )}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontWeight: 600,
            fontSize: 15,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {LABELS.PROFILE_PHOTO}
        </div>
        <button
          type="button"
          onClick={handleEditProfile}
          style={{
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
          }}
          title={LABELS.EDIT_TITLE}
        >
          <EditOutlined style={{ fontSize: 14 }} />
          <span>{LABELS.EDIT}</span>
        </button>
      </div>
      <div style={getRowBase(true)}>
        <IdcardOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.FULL_NAME}</div>
        <div style={valueCellStyle}>{currentUser?.fullname ?? LABELS.PLACEHOLDER}</div>
      </div>
      <div style={getRowBase(false)}>
        <UserOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.USERNAME}</div>
        <div style={valueCellStyle}>{currentUser?.username ?? LABELS.PLACEHOLDER}</div>
      </div>
      <div style={getRowBase(false)}>
        <MailOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.EMAIL}</div>
        <div style={valueCellStyle}>{currentUser?.email ?? LABELS.PLACEHOLDER}</div>
      </div>
      <div style={getRowBase(false)}>
        <CalendarOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.MEMBER_SINCE}</div>
        <div style={valueCellStyle}>
          {currentUser?.creationDate ? (
            <TimeAgo date={currentUser.creationDate} />
          ) : (
            LABELS.PLACEHOLDER
          )}
        </div>
      </div>
      <div style={getRowBase(false)}>
        <ClockCircleOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.LAST_LOGIN}</div>
        <div style={valueCellStyle}>
          {currentUser?.status?.lastLoginAt ? (
            <TimeAgo date={currentUser.status.lastLoginAt} />
          ) : (
            LABELS.PLACEHOLDER
          )}
        </div>
      </div>
      <div style={getRowBase(false)}>
        <SafetyCertificateOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>{LABELS.STATUS}</div>
        <div
          style={{
            ...valueCellStyle,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {currentUser?.status?.phase ? (
            <RowTag
              text={currentUser.status.phase}
              background={
                currentUser.status.phase === 'active'
                  ? `${DEFAULT_COLORS.SUCCESS}18`
                  : DEFAULT_COLORS.CHIP_CUSTOM_BG
              }
              color={
                currentUser.status.phase === 'active'
                  ? DEFAULT_COLORS.SUCCESS
                  : DEFAULT_COLORS.CHIP_CUSTOM_TEXT
              }
              fontSize={12}
            />
          ) : (
            <span style={{ fontSize: 15, color: DEFAULT_COLORS.TEXT_MUTED }}>
              {LABELS.PLACEHOLDER}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileSectionContent.displayName = 'ProfileSectionContent';

export default ProfileSectionContent;
