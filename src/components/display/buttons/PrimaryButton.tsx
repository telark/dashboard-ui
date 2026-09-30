import React from 'react';
import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { LoadingButtonInterface } from '../../../interfaces/shared';
import { BUTTON_CONFIGS, BUTTON_TEXTS } from '../../../constants';

const PrimaryButton: React.FC<LoadingButtonInterface> = ({
  action,
  loading = false,
  loadingLabel = BUTTON_TEXTS.LOADING,
  onClick,
  icon,
  color,
  disabled = false,
  style,
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
        fontWeight: BUTTON_CONFIGS.PRIMARY_BUTTON.FONT_WEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {loading ? loadingLabel : action}
    </Button>
  );
};

export default PrimaryButton;
