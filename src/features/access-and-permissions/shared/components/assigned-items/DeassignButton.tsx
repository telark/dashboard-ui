import React, { useState, useCallback } from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';

export interface DeassignButtonProps {
  onClick: () => void;
  tooltip?: string;
  disabledReason?: string;
}

const DeassignButton: React.FC<DeassignButtonProps> = ({
  onClick,
  tooltip = 'Remove',
  disabledReason,
}) => {
  const disabled = Boolean(disabledReason);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick();
    },
    [onClick],
  );

  return (
    <Tooltip title={disabledReason ?? tooltip}>
      {/* A disabled button fires no mouse events, so the span carries the tooltip hover. */}
      <span style={{ display: 'flex', flexShrink: 0 }}>
        <button
          type="button"
          disabled={disabled}
          aria-label={tooltip}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            all: 'unset',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 4,
            padding: 2,
            borderRadius: 4,
            transition: 'color 0.2s',
            color: disabled
              ? DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED
              : hovered
                ? DEFAULT_COLORS.DANGER
                : DEFAULT_COLORS.ICON_SECONDARY,
          }}
        >
          <MinusCircleOutlined style={{ fontSize: 16 }} />
        </button>
      </span>
    </Tooltip>
  );
};

export default DeassignButton;
