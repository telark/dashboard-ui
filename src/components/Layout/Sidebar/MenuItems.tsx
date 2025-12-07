import { Menu } from 'antd';
import { useState, useEffect, startTransition, memo, useMemo } from 'react';
import { MENU_LABELS, MENU_KEYS } from '../../../constants';
import {
  HomeMenuButton,
  GroupersMenuButton,
  BridgesMenuButton,
  WorkloadsMenuButton,
  UsersMenuButton,
  GroupsMenuButton,
  RolesMenuButton,
  PasskeysMenuButton,
} from './MenuButtons';

interface MenuItemsProps {
  isCollapsed?: boolean;
}

const MenuItems = memo(({ isCollapsed = false }: MenuItemsProps) => {
  const defaultOpenKeys = useMemo(() => [MENU_KEYS.RESOURCES, MENU_KEYS.USERS_AND_GROUPS], []);

  const [openKeys, setOpenKeys] = useState<string[]>(isCollapsed ? [] : defaultOpenKeys);

  useEffect(() => {
    startTransition(() => {
      setOpenKeys(isCollapsed ? [] : defaultOpenKeys);
    });
  }, [isCollapsed, defaultOpenKeys]);

  const menuStyle = useMemo(
    () => ({
      backgroundColor: 'white',
      borderRight: 'none',
      padding: 0,
      margin: 0,
      width: '100%',
    }),
    [],
  );

  const submenuStyle = useMemo(
    () => ({
      paddingTop: '0px',
    }),
    [],
  );

  const collapsedMenuItems = useMemo(
    () => (
      <>
        <GroupersMenuButton isCollapsed={isCollapsed} />
        <BridgesMenuButton isCollapsed={isCollapsed} />
        <WorkloadsMenuButton isCollapsed={isCollapsed} />
        <UsersMenuButton isCollapsed={isCollapsed} />
        <GroupsMenuButton isCollapsed={isCollapsed} />
        <RolesMenuButton isCollapsed={isCollapsed} />
        <PasskeysMenuButton isCollapsed={isCollapsed} />
      </>
    ),
    [isCollapsed],
  );

  const expandedMenuItems = useMemo(
    () => (
      <>
        <Menu.SubMenu key={MENU_KEYS.RESOURCES} title={MENU_LABELS.RESOURCES} style={submenuStyle}>
          <GroupersMenuButton isCollapsed={isCollapsed} />
          <BridgesMenuButton isCollapsed={isCollapsed} />
          <WorkloadsMenuButton isCollapsed={isCollapsed} />
        </Menu.SubMenu>
        <Menu.SubMenu
          key={MENU_KEYS.USERS_AND_GROUPS}
          title={MENU_LABELS.ACCESS_AND_PERMISSIONS}
          style={submenuStyle}
        >
          <UsersMenuButton isCollapsed={isCollapsed} />
          <GroupsMenuButton isCollapsed={isCollapsed} />
          <RolesMenuButton isCollapsed={isCollapsed} />
          <PasskeysMenuButton isCollapsed={isCollapsed} />
        </Menu.SubMenu>
      </>
    ),
    [isCollapsed, submenuStyle],
  );

  const menuKey = useMemo(
    () => (isCollapsed ? MENU_KEYS.COLLAPSED : MENU_KEYS.EXPANDED),
    [isCollapsed],
  );

  return (
    <div style={{ width: '100%', padding: 0, margin: 0 }}>
      <Menu
        key={menuKey}
        mode="inline"
        inlineCollapsed={isCollapsed}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        className="compact-menu"
        style={menuStyle}
      >
        <HomeMenuButton isCollapsed={isCollapsed} />
        {isCollapsed ? collapsedMenuItems : expandedMenuItems}
      </Menu>
    </div>
  );
});

MenuItems.displayName = 'MenuItems';

export default MenuItems;
