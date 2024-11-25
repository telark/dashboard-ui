import { Layout } from 'antd';
import UserBlock from './UserBlock';
import MenuItems from './MenuItems';

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      width={250}
      style={{
        height: "100vh",  // Ensure it takes up the full height of the screen
        backgroundColor: "white",
        position: "fixed", // Keep the sidebar fixed on the left
        left: 0, // Align the sidebar to the left of the page
        top: 0, // Align the sidebar from the top
        zIndex: 1, // Ensure it stays above the content
        paddingTop: "20px",  // Add padding to the top for spacing
        paddingLeft: "16px",  // Ensure there is space on the left of the content
        paddingRight: "16px", // Ensure there is space on the right of the content
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Ensures bottom alignment
      }}
    >
      {/* Top Section */}
      <div>
        <UserBlock />
      </div>

      {/* Menu Items */}
      <div style={{ flexGrow: 1 }}> {/* This ensures the menu takes up available space */}
        <MenuItems />
      </div>

      {/* Bottom Fixed Settings Button */}
      <div style={{ marginTop: "auto" }}>
        {/* Settings button or other content */}
      </div>
    </Sider>
  );
};

export default Sidebar;
