import React from 'react';
import AssignedItemCard from './AssignedItemCard';
import { ASSIGNED_LIST_CONTAINER_STYLE, ASSIGNED_EMPTY_STATE_STYLE } from './styles';

export interface AssignedItemsListProps<T> {
  items: T[];
  getItemKey: (item: T) => string;
  renderItemContent: (item: T) => React.ReactNode;
  loading: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  onDeassignClick?: (item: T) => void;
  deassignTooltip?: string;
  /** A returned reason keeps the deassign button visible but disabled, with it as the tooltip. */
  deassignDisabledReason?: (item: T) => string | undefined;
  /** Optional renderer for a custom element in the top-right slot of each card */
  renderRightContent?: (item: T) => React.ReactNode;
  /** When provided, controls per-item deassign button visibility. Defaults to always true. */
  canDeassign?: (item: T) => boolean;
  /** Adds a view button that opens the item in its own page's view panel. */
  onViewClick?: (item: T) => void;
  viewLabel?: string;
  /** When provided, controls per-item view button visibility. Defaults to always true. */
  canView?: (item: T) => boolean;
}

function AssignedItemsList<T>({
  items,
  getItemKey,
  renderItemContent,
  loading,
  emptyMessage = 'No items assigned yet',
  loadingMessage = 'Loading...',
  onDeassignClick,
  deassignTooltip,
  deassignDisabledReason,
  renderRightContent,
  canDeassign,
  onViewClick,
  viewLabel,
  canView,
}: AssignedItemsListProps<T>) {
  if (loading) {
    return <div style={ASSIGNED_EMPTY_STATE_STYLE}>{loadingMessage}</div>;
  }

  if (items.length === 0) {
    return <div style={ASSIGNED_EMPTY_STATE_STYLE}>{emptyMessage}</div>;
  }

  return (
    <div style={ASSIGNED_LIST_CONTAINER_STYLE}>
      {items.map((item) => {
        const deassignAllowed = canDeassign ? canDeassign(item) : true;
        return (
          <AssignedItemCard
            key={getItemKey(item)}
            onDeassign={
              onDeassignClick && deassignAllowed ? () => onDeassignClick(item) : undefined
            }
            deassignTooltip={deassignTooltip}
            deassignDisabledReason={deassignDisabledReason?.(item)}
            rightContent={renderRightContent ? renderRightContent(item) : undefined}
            onView={onViewClick && (canView?.(item) ?? true) ? () => onViewClick(item) : undefined}
            viewLabel={viewLabel}
          >
            {renderItemContent(item)}
          </AssignedItemCard>
        );
      })}
    </div>
  );
}

export default AssignedItemsList;
