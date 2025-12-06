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
  const [openKeys, setOpenKeys] = useState<string[]>([
    MENU_KEYS.RESOURCES,
    MENU_KEYS.USERS_AND_GROUPS,
  ]);

  useEffect(() => {
    if (isCollapsed) {
      startTransition(() => {
        setOpenKeys([]);
      });
    } else {
      startTransition(() => {
        setOpenKeys([MENU_KEYS.RESOURCES, MENU_KEYS.USERS_AND_GROUPS]);
      });
    }
  }, [isCollapsed]);

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

  return (
    <div style={{ width: '100%', padding: 0, margin: 0 }}>
      <Menu
        key={isCollapsed ? MENU_KEYS.COLLAPSED : MENU_KEYS.EXPANDED}
        mode="inline"
        inlineCollapsed={isCollapsed}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        className="compact-menu"
        style={menuStyle}
      >
        <HomeMenuButton isCollapsed={isCollapsed} />
        {isCollapsed ? (
          <>
            <GroupersMenuButton isCollapsed={isCollapsed} />
            <BridgesMenuButton isCollapsed={isCollapsed} />
            <WorkloadsMenuButton isCollapsed={isCollapsed} />
            <UsersMenuButton isCollapsed={isCollapsed} />
            <GroupsMenuButton isCollapsed={isCollapsed} />
            <RolesMenuButton isCollapsed={isCollapsed} />
            <PasskeysMenuButton isCollapsed={isCollapsed} />
          </>
        ) : (
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
        )}
      </Menu>
    </div>
  );
});

MenuItems.displayName = 'MenuItems';

export default MenuItems;
