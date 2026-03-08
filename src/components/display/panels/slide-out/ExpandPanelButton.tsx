import React from 'react';
import { Tooltip } from 'antd';
import { CompressOutlined, ExpandAltOutlined } from '@ant-design/icons';
import { SLIDE_OUT } from '../../../../constants';

export interface ExpandPanelButtonProps {
  expanded: boolean;
  onToggle: () => void;
  expandTooltip?: string;
  collapseTooltip?: string;
}

const ExpandPanelButton: React.FC<ExpandPanelButtonProps> = ({
  expanded,
  onToggle,
  expandTooltip = SLIDE_OUT.EXPAND_TOOLTIP,
  collapseTooltip = SLIDE_OUT.COLLAPSE_TOOLTIP,
}) => (
  <Tooltip
    title={expanded ? collapseTooltip : expandTooltip}
    placement="bottom"
  >
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={SLIDE_OUT.CLOSE_BUTTON}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = SLIDE_OUT.CLOSE_BUTTON_HOVER_COLOR;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = SLIDE_OUT.CLOSE_BUTTON_DEFAULT_COLOR;
      }}
    >
      {expanded ? <CompressOutlined /> : <ExpandAltOutlined />}
    </button>
  </Tooltip>
);

export default ExpandPanelButton;
