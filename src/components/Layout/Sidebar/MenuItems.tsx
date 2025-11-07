import { Menu } from 'antd';
import SidebarButton from '../../buttons/SideBarButton';
import { useLocation } from 'react-router-dom';
import { ICONS } from '../../../constants';

const HomeIcon = ICONS.HOME;
const RoleIcon = ICONS.ROLE;
const CategoryIcon = ICONS.CATEGORY;
const GrouperIcon = ICONS.GROUPER;
const WorkloadIcon = ICONS.WORKLOAD;
const BridgeIcon = ICONS.BRIDGE;

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
        style={{ backgroundColor: 'white', borderRight: 'none', padding: 0, marginRight: -12 }}
      >
        <SidebarButton
          text={'Home'}
          icon={<HomeIcon />}
          active={pathname === '/'}
          route="/"
          isCollapsed={isCollapsed}
        />
        <SidebarButton
          text={'Groupers'}
          icon={<GrouperIcon />}
          active={pathname.startsWith('/groupers')}
          route="/groupers"
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
          text={'Bridges'}
          icon={<BridgeIcon />}
          active={pathname.startsWith('/bridges')}
          route="/bridges"
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
      </Menu>
    </div>
  );
};

export default MenuItems;
