import React, { useState, useCallback } from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ScrollIndicator } from '../../../../components/display/indicators';
import { DEFAULT_COLORS } from '../../../../constants';
import { useRoleListScroll } from '../../groups/hooks/scroll/useRoleListScroll';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8,
  padding: '5px 14px',
  background: DEFAULT_COLORS.BACKGROUND_LIGHT,
  border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  borderLeft: `3px solid ${DEFAULT_COLORS.SUCCESS}`,
  borderRadius: 8,
  transition: 'all 0.2s ease',
  cursor: 'default',
  minHeight: '48px',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
};

const LIST_CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  overflowY: 'auto',
  width: '100%',
  padding: 0,
  boxSizing: 'border-box',
  alignItems: 'stretch',
};

const EMPTY_STATE_STYLE: React.CSSProperties = {
  padding: '24px',
  textAlign: 'center',
  color: DEFAULT_COLORS.TEXT_MUTED,
};

interface DeassignButtonProps {
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

export interface AssignedItemsViewProps<T> {
  items: T[];
  getItemKey: (item: T) => string;
  renderItemContent: (item: T) => React.ReactNode;
  loading: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  onDeassignClick?: (item: T) => void;
  deassignTooltip?: string;
}

function AssignedItemsView<T>({
  items,
  getItemKey,
  renderItemContent,
  loading,
  emptyMessage = 'No items assigned yet',
  loadingMessage = 'Loading...',
  onDeassignClick,
  deassignTooltip,
}: AssignedItemsViewProps<T>) {
  const {
    scrollContainerRef,
    setShowScrollIndicator,
    isScrollable,
    containerClassName,
    containerStyle,
    wrapperStyle,
  } = useRoleListScroll({ itemsCount: items.length });

  if (loading) {
    return <div style={EMPTY_STATE_STYLE}>{loadingMessage}</div>;
  }

  if (items.length === 0) {
    return <div style={EMPTY_STATE_STYLE}>{emptyMessage}</div>;
  }

  return (
    <div style={wrapperStyle}>
      <div
        ref={scrollContainerRef}
        className={containerClassName}
        style={{ ...LIST_CONTAINER_STYLE, ...containerStyle }}
      >
        {items.map((item) => (
          <div key={getItemKey(item)} style={CARD_STYLE}>
            <div style={{ flex: 1, minWidth: 0 }}>{renderItemContent(item)}</div>
            {onDeassignClick && (
              <DeassignButton
                onClick={() => onDeassignClick(item)}
                tooltip={deassignTooltip}
              />
            )}
          </div>
        ))}
      </div>
      <ScrollIndicator
        containerRef={scrollContainerRef}
        isScrollable={isScrollable}
        onVisibilityChange={setShowScrollIndicator}
      />
    </div>
  );
}

export default AssignedItemsView;
