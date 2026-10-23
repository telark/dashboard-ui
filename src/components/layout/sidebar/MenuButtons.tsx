import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarButton from '../../display/buttons/SideBarButton';
import { Icons, APP_ROUTES, MENU_LABELS, MENU_RAIL_LABELS } from '../../../constants';
import { useAttentionInsights } from '../../../features/insights/hooks';

// Stable icon elements keep SidebarButton's memo, so a navigation re-renders only two buttons.
const HOME_ICON = <Icons.Home />;
const ROLE_ICON = <Icons.Role />;
const APPLICATION_ICON = <Icons.Application />;
const INSIGHTS_ICON = <Icons.Insights />;
const USER_ICON = <Icons.User />;
const GROUP_ICON = <Icons.Group />;
const PROTECTION_PLANS_ICON = <Icons.ProtectionPlans />;
const SETTINGS_ICON = <Icons.Settings />;

interface MenuButtonProps {
  isCollapsed?: boolean;
}

export const HomeMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.HOME}
      railLabel={MENU_RAIL_LABELS.HOME}
      icon={HOME_ICON}
      active={pathname === APP_ROUTES.HOME}
      route={APP_ROUTES.HOME}
      isCollapsed={isCollapsed}
    />
  );
});

HomeMenuButton.displayName = 'HomeMenuButton';
export const ApplicationsMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.APPLICATIONS}
      railLabel={MENU_RAIL_LABELS.APPLICATIONS}
      icon={APPLICATION_ICON}
      active={pathname.startsWith(APP_ROUTES.APPLICATIONS)}
      route={APP_ROUTES.APPLICATIONS}
      isCollapsed={isCollapsed}
    />
  );
});

ApplicationsMenuButton.displayName = 'ApplicationsMenuButton';

export const InsightsMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const attention = useAttentionInsights().page?.total ?? 0;

  return (
    <SidebarButton
      text={MENU_LABELS.INSIGHTS}
      railLabel={MENU_RAIL_LABELS.INSIGHTS}
      icon={INSIGHTS_ICON}
      active={location.pathname.startsWith(APP_ROUTES.INSIGHTS)}
      route={APP_ROUTES.INSIGHTS}
      isCollapsed={isCollapsed}
      badge={attention}
      badgeLabel={MENU_LABELS.INSIGHTS_ATTENTION(attention)}
    />
  );
});

InsightsMenuButton.displayName = 'InsightsMenuButton';

export const UsersMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.USERS}
      railLabel={MENU_RAIL_LABELS.USERS}
      icon={USER_ICON}
      active={pathname.startsWith(APP_ROUTES.USERS)}
      route={APP_ROUTES.USERS}
      isCollapsed={isCollapsed}
    />
  );
});

UsersMenuButton.displayName = 'UsersMenuButton';

export const GroupsMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.GROUPS}
      railLabel={MENU_RAIL_LABELS.GROUPS}
      icon={GROUP_ICON}
      active={pathname.startsWith(APP_ROUTES.GROUPS)}
      route={APP_ROUTES.GROUPS}
      isCollapsed={isCollapsed}
    />
  );
});

GroupsMenuButton.displayName = 'GroupsMenuButton';

export const RolesMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.ROLES}
      railLabel={MENU_RAIL_LABELS.ROLES}
      icon={ROLE_ICON}
      active={pathname.startsWith(APP_ROUTES.ROLES)}
      route={APP_ROUTES.ROLES}
      isCollapsed={isCollapsed}
    />
  );
});

RolesMenuButton.displayName = 'RolesMenuButton';

export const ProtectionPlansMenuButton: React.FC<MenuButtonProps> = memo(
  ({ isCollapsed = false }) => {
    const location = useLocation();
    const pathname = location.pathname;

    return (
      <SidebarButton
        text={MENU_LABELS.PROTECTION_PLANS}
        railLabel={MENU_RAIL_LABELS.PROTECTION_PLANS}
        icon={PROTECTION_PLANS_ICON}
        active={pathname.startsWith(APP_ROUTES.PROTECTION_PLANS)}
        route={APP_ROUTES.PROTECTION_PLANS}
        isCollapsed={isCollapsed}
      />
    );
  },
);

ProtectionPlansMenuButton.displayName = 'ProtectionPlansMenuButton';

export const SettingsMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();

  return (
    <SidebarButton
      text={MENU_LABELS.SETTINGS}
      railLabel={MENU_RAIL_LABELS.SETTINGS}
      icon={SETTINGS_ICON}
      active={location.pathname.startsWith(APP_ROUTES.SETTINGS)}
      route={`${APP_ROUTES.SETTINGS}/profile`}
      isCollapsed={isCollapsed}
    />
  );
});

SettingsMenuButton.displayName = 'SettingsMenuButton';
