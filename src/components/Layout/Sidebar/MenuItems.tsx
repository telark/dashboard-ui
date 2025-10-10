import { Menu } from 'antd';
import { AppstoreOutlined, DeploymentUnitOutlined, BranchesOutlined } from '@ant-design/icons';
import SidebarButton from '../../buttons/SideBarButton';
import { useLocation } from 'react-router-dom';

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
          icon={<AppstoreOutlined />}
          active={pathname === '/'}
          route="/"
          isCollapsed={isCollapsed}
        />
        <SidebarButton
          text={'Groupers'}
          icon={<AppstoreOutlined />}
          active={pathname.startsWith('/groupers')}
          route="/groupers"
          isCollapsed={isCollapsed}
        />
        <SidebarButton
          text={'Workloads'}
          icon={<DeploymentUnitOutlined />}
          active={pathname.startsWith('/workloads')}
          route="/workloads"
          isCollapsed={isCollapsed}
        />
        <SidebarButton
          text={'Bridges'}
          icon={<BranchesOutlined />}
          active={pathname === '/none-bridges'}
          route="/none-bridges"
          isCollapsed={isCollapsed}
        />
      </Menu>
    </div>
  );
};

export default MenuItems;
