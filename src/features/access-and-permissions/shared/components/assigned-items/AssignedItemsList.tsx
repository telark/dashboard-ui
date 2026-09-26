import React from 'react';
import { ScrollIndicator } from '../../../../../components/display/indicators';
import { useRoleListScroll } from '../../../groups/hooks/scroll/useRoleListScroll';
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
}: AssignedItemsListProps<T>) {
  const {
    scrollContainerRef,
    setShowScrollIndicator,
    isScrollable,
    containerClassName,
    containerStyle,
    wrapperStyle,
  } = useRoleListScroll({ itemsCount: items.length });

  if (loading) {
    return <div style={ASSIGNED_EMPTY_STATE_STYLE}>{loadingMessage}</div>;
  }

  if (items.length === 0) {
    return <div style={ASSIGNED_EMPTY_STATE_STYLE}>{emptyMessage}</div>;
  }

  return (
    <div style={wrapperStyle}>
      <div
        ref={scrollContainerRef}
        className={containerClassName}
        style={{ ...ASSIGNED_LIST_CONTAINER_STYLE, ...containerStyle }}
      >
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
            >
              {renderItemContent(item)}
            </AssignedItemCard>
          );
        })}
      </div>
      <ScrollIndicator
        containerRef={scrollContainerRef}
        isScrollable={isScrollable}
        onVisibilityChange={setShowScrollIndicator}
      />
    </div>
  );
}

export default AssignedItemsList;
