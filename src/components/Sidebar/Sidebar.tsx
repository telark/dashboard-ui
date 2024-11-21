import { Layout } from "antd";
import UserBlock from "./UserBlock";
import MenuItems from "./MenuItems";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      width={250}
      style={{
        height: "100vh",
        backgroundColor: "#F7F7F7",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Ensures bottom alignment
      }}
    >
      {/* Top Section */}
      <div>
        <UserBlock />
        <MenuItems />
      </div>
    </Sider>
  );
};

export default Sidebar;
