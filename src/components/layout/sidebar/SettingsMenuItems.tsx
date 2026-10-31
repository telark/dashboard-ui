import { memo, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiChevronLeft } from 'react-icons/hi';
import { LockOutlined } from '@ant-design/icons';
import {
  UserOutlined,
  BulbOutlined,
  SafetyOutlined,
  RobotOutlined,
  DatabaseOutlined,
  PartitionOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import SidebarButton from '../../display/buttons/SideBarButton';
import SidebarSectionLabel from './SidebarSectionLabel';
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
  getSidebarLabelFade,
} from '../../../constants';

const BACK_COLLAPSED_INSET = (SIDEBAR_LAYOUT.WIDTH_COLLAPSED - FONT_SIZE.LG) / 2;

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
  discovery: `${APP_ROUTES.SETTINGS}/discovery`,
  storage: `${APP_ROUTES.SETTINGS}/storage`,
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
  discovery: <PartitionOutlined />,
  storage: <DatabaseOutlined />,
  about: <InfoCircleOutlined />,
} as const;

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
          // Home's row: the chevron and label line up with the main menu's icons and labels.
          gap: BUTTON_CONFIGS.SIDEBAR_BUTTON.GAP,
          width: '100%',
          height: 36,
          // Collapsed, the chevron sits centered in the rail; the inset settles with the edge.
          padding: isCollapsed ? `0 0 0 ${BACK_COLLAPSED_INSET}px` : `0 10px 0 ${SPACING.XL}px`,
          color: hovered ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.TEXT_MUTED,
          fontSize: FONT_SIZE.MD,
          fontWeight: FONT_WEIGHT.MEDIUM,
          transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}, ${SIDEBAR_LAYOUT.PADDING_TRANSITION}`,
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <HiChevronLeft
          style={{
            fontSize: FONT_SIZE.LG,
            flexShrink: 0,
            transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}`,
          }}
        />
        <span style={getSidebarLabelFade(isCollapsed)}>Back</span>
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

      <SidebarSectionLabel label="Personal" isCollapsed={isCollapsed} />
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

      <SidebarSectionLabel label="Platform" isCollapsed={isCollapsed} />
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
        text="Discovery"
        icon={SETTINGS_ICONS.discovery}
        active={pathname === SETTINGS_ROUTES.discovery}
        route={SETTINGS_ROUTES.discovery}
        isCollapsed={isCollapsed}
      />
      <SidebarButton
        text="Storage"
        icon={SETTINGS_ICONS.storage}
        active={pathname === SETTINGS_ROUTES.storage}
        route={SETTINGS_ROUTES.storage}
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
