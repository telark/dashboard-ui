import React from 'react';
import DeassignButton from './DeassignButton';
import { ASSIGNED_CARD_STYLE } from './styles';

export interface AssignedItemCardProps {
  children: React.ReactNode;
  onDeassign?: () => void;
  deassignTooltip?: string;
  deassignDisabledReason?: string;
  /** Optional custom element rendered in the top-right slot */
  rightContent?: React.ReactNode;
}

const AssignedItemCard: React.FC<AssignedItemCardProps> = ({
  children,
  onDeassign,
  deassignTooltip,
  deassignDisabledReason,
  rightContent,
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
  </div>
);

export default AssignedItemCard;
