import type React from 'react';

export interface ScrollIndicatorProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isScrollable: boolean;
  backgroundColor?: string;
  size?: number;
  scrollAmount?: number;
  threshold?: number;
  bottomOffset?: number;
  onVisibilityChange?: (isVisible: boolean) => void;
  className?: string;
}
