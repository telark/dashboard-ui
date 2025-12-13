import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { SCROLL_INDICATOR } from '../../constants/layout/indicators';

export interface UseScrollIndicatorOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isScrollable: boolean;
  scrollAmount?: number;
  threshold?: number;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export interface UseScrollIndicatorReturn {
  showScrollIndicator: boolean;
  handleScrollDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const useScrollIndicator = ({
  containerRef,
  isScrollable,
  scrollAmount = SCROLL_INDICATOR.SCROLL_AMOUNT,
  threshold = SCROLL_INDICATOR.THRESHOLD,
  onVisibilityChange,
}: UseScrollIndicatorOptions): UseScrollIndicatorReturn => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isScrollable) {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        const newVisibility = false;
        setShowScrollIndicator(newVisibility);
        onVisibilityChange?.(newVisibility);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;
      const newVisibility = !isAtBottom;
      setShowScrollIndicator((prev) => {
        if (prev !== newVisibility && onVisibilityChange) {
          setTimeout(() => {
            onVisibilityChange(newVisibility);
          }, 0);
        }
        return newVisibility;
      });
    };

    // Check initial state after a brief delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 0);

    // Add scroll listener
    container.addEventListener('scroll', checkScrollPosition);

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [containerRef, isScrollable, threshold, onVisibilityChange]);

  const handleScrollDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const container = containerRef.current;
      if (!container) return;

      const scrollByAmount = container.clientHeight * scrollAmount;
      container.scrollBy({
        top: scrollByAmount,
        behavior: 'smooth',
      });
    },
    [containerRef, scrollAmount],
  );

  return {
    showScrollIndicator,
    handleScrollDown,
  };
};
