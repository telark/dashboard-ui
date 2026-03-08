import React, { useMemo, useRef, useState } from 'react';
import { ROLE_LIST_SCROLL, calculateMaxHeight } from '../../constants';

export interface UseRoleListScrollOptions {
  itemsCount?: number;
  pageSize?: number;
}

export interface UseRoleListScrollReturn {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  showScrollIndicator: boolean;
  setShowScrollIndicator: (show: boolean) => void;
  isScrollable: boolean;
  maxHeight: string;
  containerClassName: string;
  containerStyle: React.CSSProperties;
  wrapperStyle: React.CSSProperties;
}

export const useRoleListScroll = (
  options: UseRoleListScrollOptions = {},
): UseRoleListScrollReturn => {
  const { itemsCount = 0, pageSize = ROLE_LIST_SCROLL.PAGE_SIZE } = options;

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const isScrollable = useMemo(() => itemsCount > pageSize, [itemsCount, pageSize]);
  const maxHeight = useMemo(() => calculateMaxHeight(pageSize), [pageSize]);

  const containerClassName = useMemo(
    () => `role-list-container ${isScrollable ? 'role-list-scroll' : ''}`,
    [isScrollable],
  );

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      maxHeight: isScrollable ? maxHeight : 'auto',
      height: isScrollable ? maxHeight : 'auto',
      overflowY: isScrollable ? 'auto' : 'visible',
    }),
    [isScrollable, maxHeight],
  );

  const wrapperStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'relative',
      width: '100%',
      paddingBottom:
        isScrollable && showScrollIndicator ? ROLE_LIST_SCROLL.SCROLL_INDICATOR_PADDING : 0,
    }),
    [isScrollable, showScrollIndicator],
  );

  return {
    scrollContainerRef,
    showScrollIndicator,
    setShowScrollIndicator,
    isScrollable,
    maxHeight,
    containerClassName,
    containerStyle,
    wrapperStyle,
  };
};
