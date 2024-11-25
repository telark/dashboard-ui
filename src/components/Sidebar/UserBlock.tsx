import { Avatar, Typography } from "antd";
import { DEFAULT_COLORS } from "../../config";

const { Text } = Typography;

const UserBlock = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
      <Avatar
        size={48}
        style={{ backgroundColor: DEFAULT_COLORS.SUCCESS, marginRight: "12px" }}
      >
        HK
      </Avatar>
      <div>
        <Text strong style={{ fontSize: "16px" }}>
          houssem kraoua
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Role
        </Text>
      </div>
    </div>
  );
};

export default UserBlock;
