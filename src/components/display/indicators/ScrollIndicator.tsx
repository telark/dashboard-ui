import React from 'react';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { SCROLL_INDICATOR } from '../../../constants/layout/indicators';
import { useScrollIndicator } from '../../../hooks/layout/useScrollIndicator';
import type { ScrollIndicatorProps } from '../../../interfaces/layout/indicators';

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  containerRef,
  isScrollable,
  backgroundColor = SCROLL_INDICATOR.BACKGROUND_COLOR,
  size = SCROLL_INDICATOR.SIZE,
  scrollAmount = SCROLL_INDICATOR.SCROLL_AMOUNT,
  threshold = SCROLL_INDICATOR.THRESHOLD,
  bottomOffset = SCROLL_INDICATOR.BOTTOM_OFFSET,
  onVisibilityChange,
  className,
}) => {
  const { showScrollIndicator, handleScrollDown } = useScrollIndicator({
    containerRef,
    isScrollable,
    scrollAmount,
    threshold,
    onVisibilityChange,
  });

  if (!isScrollable || !showScrollIndicator) {
    return null;
  }

  const iconSize = size * SCROLL_INDICATOR.ICON_SIZE_MULTIPLIER;

  return (
    <div
      className={className}
      style={{
        ...SCROLL_INDICATOR.CONTAINER,
        bottom: bottomOffset,
      }}
    >
      <button
        type="button"
        onClick={handleScrollDown}
        style={{
          ...SCROLL_INDICATOR.BUTTON,
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          background: backgroundColor,
          transition: `opacity ${SCROLL_INDICATOR.TRANSITION_DURATION}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = String(SCROLL_INDICATOR.HOVER_OPACITY);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = String(SCROLL_INDICATOR.DEFAULT_OPACITY);
        }}
      >
        <span
          style={{
            ...SCROLL_INDICATOR.ICON_WRAPPER,
            width: iconSize,
            height: iconSize,
          }}
        >
          <BsChevronDoubleDown
            style={{
              ...SCROLL_INDICATOR.ICON,
              fontSize: iconSize,
              color: SCROLL_INDICATOR.ICON_COLOR,
            }}
          />
        </span>
      </button>
    </div>
  );
};

export default ScrollIndicator;
