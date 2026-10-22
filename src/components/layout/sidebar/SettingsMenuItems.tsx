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
  DatabaseOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import SidebarButton from '../../display/buttons/SideBarButton';
import {
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  APP_ROUTES,
  SIDEBAR_LAYOUT,
  UNSTYLED_BUTTON,
  FONT_SIZE,
  FONT_WEIGHT,
  MOTION,
  SPACING,
} from '../../../constants';

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
  aiInsights: `${APP_ROUTES.SETTINGS}/insights`,
  governance: `${APP_ROUTES.SETTINGS}/discovery`,
  identityProvider: APP_ROUTES.AUTHENTICATION,
  about: `${APP_ROUTES.SETTINGS}/about`,
} as const;

// Stable icon elements keep SidebarButton's memo, so a navigation re-renders only two buttons.
const SETTINGS_ICONS = {
  profile: <UserOutlined />,
  myPermissions: <LockOutlined />,
  security: <SafetyOutlined />,
  appearance: <BulbOutlined />,
  timezone: <GlobalOutlined />,
  identityProvider: <KeyOutlined />,
  aiInsights: <RobotOutlined />,
  governance: <DatabaseOutlined />,
  about: <InfoCircleOutlined />,
} as const;

const firstSectionLabelStyle: CSSProperties = {
  ...SIDEBAR_LAYOUT.SECTION_LABEL,
  marginTop: SPACING.NONE,
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
          // Off scale, kept exact: padding 10 (SM to MD).
          ...UNSTYLED_BUTTON,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: SPACING.S6,
          width: '100%',
          height: 36,
          padding: isCollapsed ? SPACING.NONE : `0 10px 0 ${SPACING.XL}px`,
          marginBottom: SPACING.MD,
          color: hovered ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.TEXT_MUTED,
          fontSize: FONT_SIZE.MD,
          fontWeight: FONT_WEIGHT.MEDIUM,
          transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}`,
          boxSizing: 'border-box',
        }}
      >
        <HiChevronLeft
          style={{
            fontSize: FONT_SIZE.LG,
            flexShrink: 0,
            transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}`,
          }}
        />
        {!isCollapsed && (
          <span style={{ transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}` }}>Back</span>
        )}
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
        icon={SETTINGS_ICONS.profile}
        active={pathname === SETTINGS_ROUTES.profile}
        route={SETTINGS_ROUTES.profile}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="My Permissions"
        icon={SETTINGS_ICONS.myPermissions}
        active={pathname === SETTINGS_ROUTES.myPermissions}
        route={SETTINGS_ROUTES.myPermissions}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Security"
        icon={SETTINGS_ICONS.security}
        active={pathname.startsWith(SETTINGS_ROUTES.security)}
        route={SETTINGS_ROUTES.security}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Appearance"
        icon={SETTINGS_ICONS.appearance}
        active={pathname === SETTINGS_ROUTES.appearance}
        route={SETTINGS_ROUTES.appearance}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Timezone"
        icon={SETTINGS_ICONS.timezone}
        active={pathname === SETTINGS_ROUTES.timezone}
        route={SETTINGS_ROUTES.timezone}
        isCollapsed={isCollapsed}
      />

      {!isCollapsed && <div style={SIDEBAR_LAYOUT.SECTION_LABEL}>Platform</div>}
      <SidebarButton
        text="Authentication"
        icon={SETTINGS_ICONS.identityProvider}
        active={pathname === SETTINGS_ROUTES.identityProvider}
        route={SETTINGS_ROUTES.identityProvider}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Insights"
        icon={SETTINGS_ICONS.aiInsights}
        active={pathname === SETTINGS_ROUTES.aiInsights}
        route={SETTINGS_ROUTES.aiInsights}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Discovery & Storage"
        icon={SETTINGS_ICONS.governance}
        active={pathname === SETTINGS_ROUTES.governance}
        route={SETTINGS_ROUTES.governance}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="About"
        icon={SETTINGS_ICONS.about}
        active={pathname === SETTINGS_ROUTES.about}
        route={SETTINGS_ROUTES.about}
        isCollapsed={isCollapsed}
      />
    </nav>
  );
});

SettingsMenuItems.displayName = 'SettingsMenuItems';

export default SettingsMenuItems;
