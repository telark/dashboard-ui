import React from 'react';
import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { LoadingButtonInterface } from '../../interfaces/shared';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_TEXTS } from '../../constants';

const PrimaryButton: React.FC<LoadingButtonInterface> = ({
  action,
  loading = false,
  loadingLabel = BUTTON_TEXTS.LOADING,
  onClick,
  icon,
  color = DEFAULT_COLORS.SUCCESS,
  disabled = false,
}) => {
  return (
    <Button
      type={BUTTON_CONFIGS.PRIMARY_BUTTON.TYPE}
      icon={loading ? <LoadingOutlined /> : icon}
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: BUTTON_CONFIGS.PRIMARY_BUTTON.MARGIN_TOP,
        backgroundColor: color,
        borderColor: color,
      }}
    >
      {loading ? loadingLabel : action}
    </Button>
  );
};

export default PrimaryButton;
