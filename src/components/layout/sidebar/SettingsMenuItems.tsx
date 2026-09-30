import { memo, useCallback, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiChevronLeft } from 'react-icons/hi';
import { LockOutlined } from '@ant-design/icons';
import {
  UserOutlined,
  BulbOutlined,
  SafetyOutlined,
  RobotOutlined,
  AuditOutlined,
  LoginOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import SidebarButton from '../../display/buttons/SideBarButton';
import { BUTTON_CONFIGS, DEFAULT_COLORS, APP_ROUTES } from '../../../constants';

interface SettingsMenuItemsProps {
  isCollapsed: boolean;
  backPath: string;
}

const SETTINGS_ROUTES = {
  profile: `${APP_ROUTES.SETTINGS}/profile`,
  appearance: `${APP_ROUTES.SETTINGS}/appearance`,
  timezone: `${APP_ROUTES.SETTINGS}/timezone`,
  myPermissions: `${APP_ROUTES.SETTINGS}/permissions`,
  security: `${APP_ROUTES.SETTINGS}/security`,
  aiInsights: `${APP_ROUTES.SETTINGS}/aiInsights`,
  governance: `${APP_ROUTES.SETTINGS}/governance`,
  identityProvider: `${APP_ROUTES.SETTINGS}/identity`,
  about: `${APP_ROUTES.SETTINGS}/about`,
} as const;

const sectionLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: DEFAULT_COLORS.TEXT_SECONDARY,
  padding: '4px 12px 2px 22px',
  marginTop: 20,
  userSelect: 'none',
};

const firstSectionLabelStyle: CSSProperties = {
  ...sectionLabelStyle,
  marginTop: 0,
};

const BackButton = memo(
  ({ isCollapsed, onClick }: { isCollapsed: boolean; onClick: () => void }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Back"
        title={isCollapsed ? 'Back' : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 6,
          width: '100%',
          height: 36,
          padding: isCollapsed ? 0 : '0 10px 0 20px',
          marginBottom: 12,
          border: 'none',
          background: 'transparent',
          color: hovered ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.TEXT_MUTED,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'color 150ms ease',
          boxSizing: 'border-box',
        }}
      >
        <HiChevronLeft style={{ fontSize: 16, flexShrink: 0, transition: 'color 150ms ease' }} />
        {!isCollapsed && <span style={{ transition: 'color 150ms ease' }}>Back</span>}
      </button>
    );
  },
);

BackButton.displayName = 'BackButton';

const SettingsMenuItems = memo(({ isCollapsed, backPath }: SettingsMenuItemsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const handleBack = useCallback(() => {
    navigate(backPath);
  }, [navigate, backPath]);

  return (
    <nav
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: BUTTON_CONFIGS.SIDEBAR_BUTTON.ITEM_GAP_PX,
      }}
    >
      <BackButton isCollapsed={isCollapsed} onClick={handleBack} />

      {!isCollapsed && <div style={firstSectionLabelStyle}>Personal</div>}
      <SidebarButton
        text="Profile"
        icon={<UserOutlined />}
        active={pathname === SETTINGS_ROUTES.profile}
        route={SETTINGS_ROUTES.profile}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="My Permissions"
        icon={<LockOutlined />}
        active={pathname === SETTINGS_ROUTES.myPermissions}
        route={SETTINGS_ROUTES.myPermissions}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Security"
        icon={<SafetyOutlined />}
        active={pathname.startsWith(SETTINGS_ROUTES.security)}
        route={SETTINGS_ROUTES.security}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Appearance"
        icon={<BulbOutlined />}
        active={pathname === SETTINGS_ROUTES.appearance}
        route={SETTINGS_ROUTES.appearance}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Timezone"
        icon={<GlobalOutlined />}
        active={pathname === SETTINGS_ROUTES.timezone}
        route={SETTINGS_ROUTES.timezone}
        isCollapsed={isCollapsed}
      />

      {!isCollapsed && <div style={sectionLabelStyle}>Platform</div>}
      <SidebarButton
        text="Insights"
        icon={<RobotOutlined />}
        active={pathname === SETTINGS_ROUTES.aiInsights}
        route={SETTINGS_ROUTES.aiInsights}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Governance"
        icon={<AuditOutlined />}
        active={pathname === SETTINGS_ROUTES.governance}
        route={SETTINGS_ROUTES.governance}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Single Sign-On"
        icon={<LoginOutlined />}
        active={pathname === SETTINGS_ROUTES.identityProvider}
        route={SETTINGS_ROUTES.identityProvider}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="About"
        icon={<InfoCircleOutlined />}
        active={pathname === SETTINGS_ROUTES.about}
        route={SETTINGS_ROUTES.about}
        isCollapsed={isCollapsed}
      />
    </nav>
  );
});

SettingsMenuItems.displayName = 'SettingsMenuItems';

export default SettingsMenuItems;
