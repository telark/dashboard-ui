export const ROLE_LIST_SCROLL = {
  PAGE_SIZE: 11,
  ITEM_MIN_HEIGHT: 48,
  ITEM_GAP: 8,
  SCROLL_INDICATOR_PADDING: 24,
} as const;

export const calculateMaxHeight = (pageSize: number): string => {
  const itemHeight = ROLE_LIST_SCROLL.ITEM_MIN_HEIGHT + ROLE_LIST_SCROLL.ITEM_GAP;
  return `${pageSize * itemHeight}px`;
};
