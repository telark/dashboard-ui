import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarButton from '../../display/buttons/SideBarButton';
import { Icons, APP_ROUTES, MENU_LABELS } from '../../../constants';

const HomeIcon = Icons.Home;
const RoleIcon = Icons.Role;
const GrouperIcon = Icons.Grouper;
const WorkloadIcon = Icons.Workload;
const ApplicationIcon = Icons.Application;
const BridgeIcon = Icons.Bridge;
const UserIcon = Icons.User;
const GroupIcon = Icons.Group;
const ProtectionPlansIcon = Icons.ProtectionPlans;

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

export const GroupersMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.GROUPERS}
      icon={<GrouperIcon />}
      active={pathname.startsWith(APP_ROUTES.GROUPERS)}
      route={APP_ROUTES.GROUPERS}
      isCollapsed={isCollapsed}
    />
  );
});

GroupersMenuButton.displayName = 'GroupersMenuButton';

export const BridgesMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.BRIDGES}
      icon={<BridgeIcon />}
      active={pathname.startsWith(APP_ROUTES.BRIDGES)}
      route={APP_ROUTES.BRIDGES}
      isCollapsed={isCollapsed}
    />
  );
});

BridgesMenuButton.displayName = 'BridgesMenuButton';

export const WorkloadsMenuButton: React.FC<MenuButtonProps> = memo(({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.WORKLOADS}
      icon={<WorkloadIcon />}
      active={pathname.startsWith(APP_ROUTES.WORKLOADS)}
      route={APP_ROUTES.WORKLOADS}
      isCollapsed={isCollapsed}
    />
  );
});

WorkloadsMenuButton.displayName = 'WorkloadsMenuButton';

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
