import React, { useState, useCallback } from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';

export interface DeassignButtonProps {
  onClick: () => void;
  tooltip?: string;
}

const DeassignButton: React.FC<DeassignButtonProps> = ({ onClick, tooltip = 'Remove' }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick();
    },
    [onClick],
  );

  return (
    <Tooltip title={tooltip}>
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 4,
          padding: 2,
          borderRadius: 4,
          transition: 'color 0.2s',
          color: hovered ? DEFAULT_COLORS.ERROR : DEFAULT_COLORS.ICON_SECONDARY,
        }}
      >
        <MinusCircleOutlined style={{ fontSize: 16 }} />
      </button>
    </Tooltip>
  );
};

export default DeassignButton;
