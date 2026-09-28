/** Parse "12%" or "12 %" style strings from snapshot API. */
export function parseConsumedPercent(consumed: string): number | null {
  const m = consumed.trim().match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (!m) return null;
  const n = Number(m[1]);
  if (Number.isNaN(n)) return null;
  return Math.min(100, Math.max(0, n));
}
