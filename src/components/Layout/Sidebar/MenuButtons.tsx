import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarButton from '../../buttons/SideBarButton';
import { Icons, APP_ROUTES, MENU_LABELS } from '../../../constants';

const HomeIcon = Icons.HOME;
const RoleIcon = Icons.ROLE;
const GrouperIcon = Icons.GROUPER;
const WorkloadIcon = Icons.WORKLOAD;
const BridgeIcon = Icons.BRIDGE;
const UserIcon = Icons.USER;
const GroupIcon = Icons.GROUP;
const PasskeyIcon = Icons.PASSKEY;

interface MenuButtonProps {
  isCollapsed?: boolean;
}

export const HomeMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
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
};

export const GroupersMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
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
};

export const BridgesMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
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
};

export const WorkloadsMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
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
};

export const UsersMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
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
};

export const GroupsMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
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
};

export const RolesMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
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
};

export const PasskeysMenuButton: React.FC<MenuButtonProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarButton
      text={MENU_LABELS.PASSKEYS}
      icon={<PasskeyIcon />}
      active={pathname.startsWith(APP_ROUTES.PASSKEYS)}
      route={APP_ROUTES.PASSKEYS}
      isCollapsed={isCollapsed}
    />
  );
};
