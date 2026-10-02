import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarButton from '../../display/buttons/SideBarButton';
import { Icons, APP_ROUTES, MENU_LABELS } from '../../../constants';

const HomeIcon = Icons.Home;
const RoleIcon = Icons.Role;
const ApplicationIcon = Icons.Application;
const InsightsIcon = Icons.Insights;
const UserIcon = Icons.User;
const GroupIcon = Icons.Group;
const ProtectionPlansIcon = Icons.ProtectionPlans;
const SettingsIcon = Icons.Settings;

interface MenuButtonProps {
  isCollapsed?: boolean;
}

export const HomeMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.HOME}
      icon={<HomeIcon />}
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
      icon={<ApplicationIcon />}
      active={pathname.startsWith(APP_ROUTES.APPLICATIONS)}
      route={APP_ROUTES.APPLICATIONS}
      isCollapsed={isCollapsed}
    />
  );
});

ApplicationsMenuButton.displayName = 'ApplicationsMenuButton';

export const InsightsMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();

  return (
    <SidebarButton
      text={MENU_LABELS.INSIGHTS}
      icon={<InsightsIcon />}
      active={location.pathname.startsWith(APP_ROUTES.INSIGHTS)}
      route={APP_ROUTES.INSIGHTS}
      isCollapsed={isCollapsed}
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
      icon={<UserIcon />}
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
      icon={<GroupIcon />}
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
      icon={<RoleIcon />}
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
        icon={<ProtectionPlansIcon />}
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
      icon={<SettingsIcon />}
      active={location.pathname.startsWith(APP_ROUTES.SETTINGS)}
      route={`${APP_ROUTES.SETTINGS}/profile`}
      isCollapsed={isCollapsed}
    />
  );
});

SettingsMenuButton.displayName = 'SettingsMenuButton';
