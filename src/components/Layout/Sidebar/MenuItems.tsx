import { Divider, Menu } from 'antd';
import { AppstoreOutlined, DeploymentUnitOutlined, BranchesOutlined } from '@ant-design/icons';
import SidebarButton from '../../buttons/SideBarButton';
import { useLocation } from 'react-router-dom';

const MenuItems = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div>
      {/* Dashboard Button */}
      <Menu mode="inline" style={{ backgroundColor: 'white', borderRight: 'none', padding: 0 }}>
        <SidebarButton text="Home" icon={<AppstoreOutlined />} active={pathname === '/'} route="/" />
      </Menu>

      {/* Divider */}
      <Divider style={{ margin: '16px 0', borderColor: '#E0E0E0' }} />

      {/* Other Menu Buttons */}
      <Menu mode="inline" style={{ backgroundColor: 'white', borderRight: 'none', padding: 0 }}>
        <SidebarButton text="Groupers" icon={<AppstoreOutlined />} active={pathname.startsWith('/groupers')} route="/groupers" />
        <SidebarButton text="Workloads" icon={<DeploymentUnitOutlined />} active={pathname === '/none-workloads'} route="/none-workloads" />
        <SidebarButton text="Bridges" icon={<BranchesOutlined />} active={pathname === '/none-bridges'} route="/none-bridges" />
      </Menu>
    </div>
  );
};

export default MenuItems;
