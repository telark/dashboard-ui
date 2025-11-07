import { Menu } from 'antd';
import SidebarButton from '../../buttons/SideBarButton';
import { useLocation } from 'react-router-dom';
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
  return (
    <div>
      <Menu
        mode="inline"
        inlineCollapsed={isCollapsed}
        className="compact-menu"
        style={{ backgroundColor: 'white', borderRight: 'none', padding: 0, marginRight: -12 }}
      >
        <SidebarButton
          text={'Home'}
          icon={<HomeIcon />}
          active={pathname === '/'}
          route="/"
          isCollapsed={isCollapsed}
        />
        <Menu.ItemGroup
          title={!isCollapsed ? 'Resources' : ''}
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
        </Menu.ItemGroup>
        <Menu.ItemGroup
          title={!isCollapsed ? 'Users and Groups' : ''}
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
        </Menu.ItemGroup>
      </Menu>
    </div>
  );
};

export default MenuItems;
