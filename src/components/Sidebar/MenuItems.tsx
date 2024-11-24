import { Divider, Menu } from "antd";
import {
  DashboardOutlined,
  ApartmentOutlined,
  ProductOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import PrimaryButton from "../Common/PrimaryButton";

const MenuItems = () => {
  return (
    <div>
      {/* Dashboard Button */}
      <Menu mode="inline" style={{ backgroundColor: "white", borderRight: "none" }}>
        <PrimaryButton text="Dashboard" icon={<DashboardOutlined />} active route="/none" />
      </Menu>

      {/* Divider */}
      <Divider style={{ margin: "16px 0", borderColor: "#E0E0E0" }} />

      {/* Other Menu Buttons */}
      <Menu mode="inline" style={{ backgroundColor: "white", borderRight: "none" }}>
        <PrimaryButton text="Groupers" icon={<ApartmentOutlined />} route="/groupers" />
        <PrimaryButton text="Workloads" icon={<ProductOutlined />} route="/none" />
        <PrimaryButton text="Bridges" icon={<FileTextOutlined />} route="/none" />
      </Menu>
    </div>
  );
};

export default MenuItems;
