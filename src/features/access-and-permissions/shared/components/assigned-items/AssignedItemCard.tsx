import React from 'react';
import DeassignButton from './DeassignButton';
import { ASSIGNED_CARD_STYLE } from './styles';

export interface AssignedItemCardProps {
  children: React.ReactNode;
  onDeassign?: () => void;
  deassignTooltip?: string;
}

const AssignedItemCard: React.FC<AssignedItemCardProps> = ({
  children,
  onDeassign,
  deassignTooltip,
}) => (
  <div style={ASSIGNED_CARD_STYLE}>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    {onDeassign && <DeassignButton onClick={onDeassign} tooltip={deassignTooltip} />}
  </div>
);

export default AssignedItemCard;
