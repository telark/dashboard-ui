import React from "react";
import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { LoadingButtonInterface } from "../../interfaces/common";
import { DEFAULT_COLORS } from "../../config";

const PrimaryButton: React.FC<LoadingButtonInterface> = ({
  action,
  loading = false,
  loadingLabel = "In Progress...",
  onClick,
  icon,
  color = DEFAULT_COLORS.SUCCESS, // Default Color
  disabled = false,
}) => {
  return (
    <Button
      type="primary"
      icon={loading ? <LoadingOutlined /> : icon}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: "20px",
        backgroundColor: color,
        borderColor: color,
      }}
    >
      {loading ? loadingLabel : action}
    </Button>
  );
};

export default PrimaryButton;
