import React from 'react';
import { Button } from 'antd';

import { NoLoadingButtonInterface } from '../../interfaces/common';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_COLORS } from '../../constants';

const PrimaryButtonWithOutLoading: React.FC<NoLoadingButtonInterface> = ({
  action,
  onClick,
  icon,
  color = DEFAULT_COLORS.SUCCESS,
  disabled = false,
}) => {
  return (
    <Button
      type={BUTTON_CONFIGS.PRIMARY_BUTTON.TYPE}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: BUTTON_CONFIGS.PRIMARY_BUTTON.MARGIN_TOP,
        backgroundColor: disabled ? BUTTON_COLORS.DISABLED : color,
        borderColor: disabled ? BUTTON_COLORS.DISABLED : color,
      }}
    >
      {action}
    </Button>
  );
};

export default PrimaryButtonWithOutLoading;
