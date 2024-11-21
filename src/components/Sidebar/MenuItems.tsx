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
      <Menu mode="inline" style={{ backgroundColor: "white", borderRight: "none" }}>
        <SidebarButton text="Dashboard" icon={<DashboardOutlined />} active route="/none" />
      </Menu>

      {/* Divider */}
      <Divider style={{ margin: "16px 0", borderColor: "#E0E0E0" }} />

      {/* Other Menu Buttons */}
      <Menu mode="inline" style={{ backgroundColor: "white", borderRight: "none" }}>
        <SidebarButton text="Groupers" icon={<ApartmentOutlined />} route="/groupers" />
        <SidebarButton text="Workloads" icon={<ProductOutlined />} route="/none" />
        <SidebarButton text="Bridges" icon={<FileTextOutlined />} route="/none" />
      </Menu>
    </div>
  );
};

export default MenuItems;
