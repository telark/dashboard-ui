import { Menu } from 'antd';
import SidebarButton from '../../buttons/SideBarButton';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ICONS, APP_ROUTES } from '../../../constants';

const HomeIcon = ICONS.HOME;
const RoleIcon = ICONS.ROLE;
const CategoryIcon = ICONS.CATEGORY;
const GrouperIcon = ICONS.GROUPER;
const WorkloadIcon = ICONS.WORKLOAD;
const BridgeIcon = ICONS.BRIDGE;
const UserIcon = ICONS.USER;
const GroupIcon = ICONS.GROUP;

interface MenuItemsProps {
  isCollapsed?: boolean;
}

const MenuItems = ({ isCollapsed = false }: MenuItemsProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openKeys, setOpenKeys] = useState<string[]>(['resources', 'users-and-groups']);

  useEffect(() => {
    if (isCollapsed) {
      setOpenKeys([]);
    } else {
      setOpenKeys(['resources', 'users-and-groups']);
    }
  }, [isCollapsed]);
  return (
    <div style={{ width: '100%', padding: 0, margin: 0 }}>
      <Menu
        key={isCollapsed ? 'collapsed' : 'expanded'}
        mode="inline"
        inlineCollapsed={isCollapsed}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        className="compact-menu"
        style={{ backgroundColor: 'white', borderRight: 'none', padding: 0, margin: 0, width: '100%' }}
      >
        <SidebarButton
          text={'Home'}
          icon={<HomeIcon />}
          active={pathname === '/'}
          route="/"
          isCollapsed={isCollapsed}
        />
        {isCollapsed ? (
          <>
            <SidebarButton
              text={'Groupers'}
              icon={<GrouperIcon />}
              active={pathname.startsWith('/groupers')}
              route="/groupers"
              isCollapsed={isCollapsed}
            />
            <SidebarButton
              text={'Bridges'}
              icon={<BridgeIcon />}
              active={pathname.startsWith('/bridges')}
              route="/bridges"
              isCollapsed={isCollapsed}
            />
            <SidebarButton
              text={'Workloads'}
              icon={<WorkloadIcon />}
              active={pathname.startsWith('/workloads')}
              route="/workloads"
              isCollapsed={isCollapsed}
            />
            <SidebarButton
              text={'Users'}
              icon={<UserIcon />}
              active={pathname.startsWith(APP_ROUTES.USERS)}
              route={APP_ROUTES.USERS}
              isCollapsed={isCollapsed}
            />
            <SidebarButton
              text={'Groups'}
              icon={<GroupIcon />}
              active={pathname.startsWith(APP_ROUTES.GROUPS)}
              route={APP_ROUTES.GROUPS}
              isCollapsed={isCollapsed}
            />
            <SidebarButton
              text={'Roles'}
              icon={<RoleIcon />}
              active={pathname.startsWith('/roles')}
              route="/roles"
              isCollapsed={isCollapsed}
            />
            <SidebarButton
              text={'Categories'}
              icon={<CategoryIcon />}
              active={pathname.startsWith('/categories')}
              route="/categories"
              isCollapsed={isCollapsed}
            />
          </>
        ) : (
          <>
            <Menu.SubMenu
              key="resources"
              title="Resources"
              style={{
                paddingTop: '0px',
              }}
            >
              <SidebarButton
                text={'Groupers'}
                icon={<GrouperIcon />}
                active={pathname.startsWith('/groupers')}
                route="/groupers"
                isCollapsed={isCollapsed}
              />
              <SidebarButton
                text={'Bridges'}
                icon={<BridgeIcon />}
                active={pathname.startsWith('/bridges')}
                route="/bridges"
                isCollapsed={isCollapsed}
              />
              <SidebarButton
                text={'Workloads'}
                icon={<WorkloadIcon />}
                active={pathname.startsWith('/workloads')}
                route="/workloads"
                isCollapsed={isCollapsed}
              />
            </Menu.SubMenu>
            <Menu.SubMenu
              key="users-and-groups"
              title="Access Management"
              style={{
                paddingTop: '0px',
              }}
            >
              <SidebarButton
                text={'Users'}
                icon={<UserIcon />}
                active={pathname.startsWith(APP_ROUTES.USERS)}
                route={APP_ROUTES.USERS}
                isCollapsed={isCollapsed}
              />
              <SidebarButton
                text={'Groups'}
                icon={<GroupIcon />}
                active={pathname.startsWith(APP_ROUTES.GROUPS)}
                route={APP_ROUTES.GROUPS}
                isCollapsed={isCollapsed}
              />
              <SidebarButton
                text={'Roles'}
                icon={<RoleIcon />}
                active={pathname.startsWith('/roles')}
                route="/roles"
                isCollapsed={isCollapsed}
              />
              <SidebarButton
                text={'Categories'}
                icon={<CategoryIcon />}
                active={pathname.startsWith('/categories')}
                route="/categories"
                isCollapsed={isCollapsed}
              />
            </Menu.SubMenu>
          </>
        )}
      </Menu>
    </div>
  );
};

export default MenuItems;
