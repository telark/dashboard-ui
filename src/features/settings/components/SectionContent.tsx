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
import { DEFAULT_COLORS, HEADER_CONSTANTS } from '../../../constants';
import SettingsCard from './SettingsCard';
import { SETTINGS_CONSTANTS } from '../constants';
import type { SettingsSectionKey } from '../constants';
import { getCurrentUser } from '../../auth/utils';
import { fetchCurrentUserDetails } from '../../access-and-permissions/users/utils';
import UserAvatar from '../../../components/display/avatars/UserAvatar';
import TimeAgo from '../../../components/display/time/TimeAgo';
import RowTag from '../../../components/display/table/RowTag';
import type { User } from '../../access-and-permissions/users/models';

const { CONTENT } = SETTINGS_CONSTANTS;
const AVATAR_SIZE = 40;
const AVATAR_BORDER = HEADER_CONSTANTS.USER.AVATAR.BORDER_WIDTH;

const iconStyle = { color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 16 };
const PROFILE_ROW_GAP = 12;

const rowBase = {
  display: 'flex' as const,
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: 8,
  borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  minHeight: 32,
  paddingTop: 0,
  paddingBottom: 0,
};

const profileRowLabelStyle = {
  fontSize: 12 as const,
  fontWeight: 500 as const,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em' as const,
  flexShrink: 0 as const,
  minWidth: 100,
};

const ProfileSection: React.FC = memo(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const handleEditProfile = useCallback(() => {}, []);

  useEffect(() => {
    const initial = getCurrentUser();
    if (initial?.id) {
      fetchCurrentUserDetails((user) => setCurrentUser(user));
    }
  }, []);

  const avatarWrapperSize = AVATAR_SIZE + AVATAR_BORDER * 2;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: PROFILE_ROW_GAP,
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
              size={AVATAR_SIZE}
              style={{ border: 'none' }}
            />
          ) : (
            <div
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
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
              —
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
          Profile photo
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
          title="Edit profile"
        >
          <EditOutlined style={{ fontSize: 14 }} />
          <span>Edit</span>
        </button>
      </div>
      <div style={rowBase}>
        <IdcardOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>Full name</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            marginLeft: 'auto',
            textAlign: 'right',
          }}
        >
          {currentUser?.fullname ?? '—'}
        </div>
      </div>
      <div style={{ ...rowBase, borderTop: 'none' }}>
        <UserOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>Username</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            marginLeft: 'auto',
            textAlign: 'right',
          }}
        >
          {currentUser?.username ?? '—'}
        </div>
      </div>
      <div style={{ ...rowBase, borderTop: 'none' }}>
        <MailOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>Email</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            marginLeft: 'auto',
            textAlign: 'right',
          }}
        >
          {currentUser?.email ?? '—'}
        </div>
      </div>
      <div style={{ ...rowBase, borderTop: 'none' }}>
        <CalendarOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>Member since</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            marginLeft: 'auto',
            textAlign: 'right',
          }}
        >
          {currentUser?.creationDate ? (
            <TimeAgo date={currentUser.creationDate} />
          ) : (
            '—'
          )}
        </div>
      </div>
      <div style={{ ...rowBase, borderTop: 'none' }}>
        <ClockCircleOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>Last login</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            marginLeft: 'auto',
            textAlign: 'right',
          }}
        >
          {currentUser?.status?.lastLoginAt ? (
            <TimeAgo date={currentUser.status.lastLoginAt} />
          ) : (
            '—'
          )}
        </div>
      </div>
      <div style={{ ...rowBase, borderTop: 'none' }}>
        <SafetyCertificateOutlined style={iconStyle} />
        <div style={profileRowLabelStyle}>Status</div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            marginLeft: 'auto',
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
            <span style={{ fontSize: 15, color: DEFAULT_COLORS.TEXT_MUTED }}>—</span>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileSection.displayName = 'ProfileSection';

interface SectionContentProps {
  sectionKey: SettingsSectionKey;
}

const SectionContent: React.FC<SectionContentProps> = memo(({ sectionKey }) => {
  switch (sectionKey) {
    case 'profile':
      return <ProfileSection />;
    case 'appearance':
      return (
        <>
          <SettingsCard
            title="Theme"
            description="Choose how the dashboard looks. System preference support coming soon."
          >
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              {['Light', 'Dark', 'System'].map((theme) => (
                <div
                  key={theme}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                    background:
                      theme === 'Light' ? 'rgba(32, 201, 151, 0.08)' : DEFAULT_COLORS.BACKGROUND_WHITE,
                    color: theme === 'Light' ? '#0d9488' : DEFAULT_COLORS.TEXT_MUTED,
                    fontWeight: theme === 'Light' ? 600 : 500,
                    fontSize: 14,
                    cursor: 'default',
                  }}
                >
                  {theme}
                </div>
              ))}
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Density"
              description="Compact or comfortable spacing for lists and tables."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Comfortable (default)
              </div>
            </SettingsCard>
          </div>
        </>
      );
    case 'notifications':
      return (
        <>
          <SettingsCard
            title="Email notifications"
            description="Choose which updates you want to receive by email."
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Security alerts', 'Product updates', 'Weekly digest'].map((label, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom:
                      i < 2 ? `1px solid ${DEFAULT_COLORS.BACKGROUND_HOVER}` : 'none',
                  }}
                >
                  <span style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_SECONDARY }}>
                    {label}
                  </span>
                  <div
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      background: DEFAULT_COLORS.BORDER_LIGHT,
                      cursor: 'default',
                    }}
                  />
                </div>
              ))}
            </div>
          </SettingsCard>
        </>
      );
    case 'security':
      return (
        <>
          <SettingsCard
            title="Password"
            description="Change your password. Use a strong password you don’t use elsewhere."
          >
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
              Password change will be available here.
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Two-factor authentication"
              description="Add an extra layer of security to your account."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                2FA setup coming soon.
              </div>
            </SettingsCard>
          </div>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Active sessions"
              description="Manage devices where you’re currently signed in."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Session management coming soon.
              </div>
            </SettingsCard>
          </div>
        </>
      );
    case 'preferences':
      return (
        <>
          <SettingsCard
            title="Language"
            description="Select your preferred language for the interface."
          >
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
              English (default)
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Timezone"
              description="All dates and times will be shown in this timezone."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Browser default
              </div>
            </SettingsCard>
          </div>
        </>
      );
    case 'about':
      return (
        <>
          <SettingsCard title="Version" description="Current application version.">
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 14,
                color: DEFAULT_COLORS.SUCCESS,
              }}
            >
              1.0.0
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard title="Support" description="Documentation and help resources.">
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Links to docs and support will appear here.
              </div>
            </SettingsCard>
          </div>
        </>
      );
    default:
      return null;
  }
});

SectionContent.displayName = 'SectionContent';

export default SectionContent;
