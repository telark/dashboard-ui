import { Divider, Menu } from "antd";
import {
  DashboardOutlined,
  ApartmentOutlined,
  ProductOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import SidebarButton from "../Buttons/SidebarButton";

const MenuItems = () => {
  return (
    <div>
      {/* Dashboard Button */}
      <Menu mode="inline" style={{backgroundColor: "#F7F7F7", borderRight: "none",}}>
        <SidebarButton text="Dashboard" icon={<DashboardOutlined />} active />
      </Menu>

      {/* Divider */}
      <Divider style={{ margin: "16px 0", borderColor: "#E0E0E0" }} />

      {/* Other Menu Buttons */}
      <Menu mode="inline" style={{backgroundColor: "#F7F7F7", borderRight: "none",}}>
        <SidebarButton text="Groupers" icon={<ApartmentOutlined />} />
        <SidebarButton text="Workloads" icon={<ProductOutlined />} />
        <SidebarButton text="Bridges" icon={<FileTextOutlined />} />
      </Menu>
    </div>
  );
};

export default MenuItems;
