import { Menu } from 'antd';
import SidebarButton from '../../buttons/SideBarButton';
import { useLocation } from 'react-router-dom';
import {
  AiOutlineCluster,
  AiOutlineApi,
  AiOutlineAppstore,
  AiOutlineDashboard,
} from 'react-icons/ai';
import { ICONS } from '../../../constants';

const RoleIcon = ICONS.ROLE;
const CategoryIcon = ICONS.CATEGORY;

interface MenuItemsProps {
  isCollapsed?: boolean;
}

const MenuItems = ({ isCollapsed = false }: MenuItemsProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div>
      {/* All Menu Buttons */}
      <Menu
        mode="inline"
        inlineCollapsed={isCollapsed}
        style={{ backgroundColor: 'white', borderRight: 'none', padding: 0, marginRight: -12 }}
      >
        <SidebarButton
          text={'Home'}
          icon={<AiOutlineDashboard />}
          active={pathname === '/'}
          route="/"
          isCollapsed={isCollapsed}
        />
        <SidebarButton
          text={'Groupers'}
          icon={<AiOutlineCluster />}
          active={pathname.startsWith('/groupers')}
          route="/groupers"
          isCollapsed={isCollapsed}
        />
        <SidebarButton
          text={'Workloads'}
          icon={<AiOutlineAppstore />}
          active={pathname.startsWith('/workloads')}
          route="/workloads"
          isCollapsed={isCollapsed}
        />
        <SidebarButton
          text={'Bridges'}
          icon={<AiOutlineApi />}
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
