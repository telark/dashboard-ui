import React from 'react';
import { Button } from 'antd';

import { NoLoadingButtonInterface } from '../../interfaces/common';
import { DEFAULT_COLORS } from '../../constants';

const PrimaryButtonWithOutLoading: React.FC<NoLoadingButtonInterface> = ({
  action,
  onClick,
  icon,
  color = DEFAULT_COLORS.SUCCESS,
  disabled = false,
}) => {
  return (
    <Button
      type="primary"
      icon={icon}
      onClick={onClick}
      disabled={disabled} // Use the disabled prop
      style={{
        marginTop: '20px',
        backgroundColor: disabled ? '#d9d9d9' : color, // Change color if disabled
        borderColor: disabled ? '#d9d9d9' : color,
      }}
    >
      {action}
    </Button>
  );
};

export default PrimaryButtonWithOutLoading;
