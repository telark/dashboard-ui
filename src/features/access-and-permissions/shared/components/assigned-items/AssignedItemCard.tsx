import React from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import DeassignButton from './DeassignButton';
import { ASSIGNED_CARD_STYLE, ASSIGNED_VIEW_BUTTON_STYLE } from './styles';

export interface AssignedItemCardProps {
  children: React.ReactNode;
  onDeassign?: () => void;
  deassignTooltip?: string;
  deassignDisabledReason?: string;
  /** Optional custom element rendered in the top-right slot */
  rightContent?: React.ReactNode;
  /** Opens the item in its own page's view panel. */
  onView?: () => void;
  viewLabel?: string;
}

const AssignedItemCard: React.FC<AssignedItemCardProps> = ({
  children,
  onDeassign,
  deassignTooltip,
  deassignDisabledReason,
  rightContent,
  onView,
  viewLabel,
}) => (
  <div style={ASSIGNED_CARD_STYLE}>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    {rightContent ??
      (onDeassign && (
        <DeassignButton
          onClick={onDeassign}
          tooltip={deassignTooltip}
          disabledReason={deassignDisabledReason}
        />
      ))}
    {onView && (
      <Tooltip title={viewLabel}>
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={onView}
          style={ASSIGNED_VIEW_BUTTON_STYLE}
          aria-label={viewLabel}
        />
      </Tooltip>
    )}
  </div>
);

export default AssignedItemCard;
