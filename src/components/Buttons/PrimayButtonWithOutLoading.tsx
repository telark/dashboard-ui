import React from "react";
import { Button } from "antd";

import { NoLoadingButtonInterface } from "../../interfaces/common";
import { DEFAULT_COLORS } from "../../config";

const PrimaryButtonWithOutLoading: React.FC<NoLoadingButtonInterface> = ({
  action,
  onClick,
  icon,
  color = DEFAULT_COLORS.SUCCESS, // Default Color
}) => {
  return (
    <Button
      type="primary"
      icon={icon}
      onClick={onClick}
      style={{
        marginTop: "20px",
        backgroundColor: color,
        borderColor: color,
      }}
    >
      {action}
    </Button>
  );
};

export default PrimaryButtonWithOutLoading;
