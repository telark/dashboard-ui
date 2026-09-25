import { current, isDraft } from '@reduxjs/toolkit';

// A refetch returns new objects for every item; keeping the existing object when the
// content is identical lets memoized rows and cards skip re-rendering.
export const keepUnchanged = <T>(previous: T[], next: T[], keyOf: (item: T) => string): T[] => {
  const byKey = new Map(previous.map((item) => [keyOf(item), item]));
  const merged = next.map((item) => {
    const kept = byKey.get(keyOf(item));
    if (kept === undefined) return item;
    const plain: unknown = isDraft(kept) ? current(kept as object) : kept;
    return JSON.stringify(plain) === JSON.stringify(item) ? kept : item;
  });
  // Nothing changed: keep the array itself too, so list-wide selectors stay equal.
  const unchanged =
    merged.length === previous.length && merged.every((item, i) => item === previous[i]);
  return unchanged ? previous : merged;
};
