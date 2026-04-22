import type { ApplicationSnapshotSummary } from '../../models';

/** Parse "12%" or "12 %" style strings from snapshot API. */
export function parseConsumedPercent(consumed: string): number | null {
  const m = consumed.trim().match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (!m) return null;
  const n = Number(m[1]);
  if (Number.isNaN(n)) return null;
  return Math.min(100, Math.max(0, n));
}

const BYTE_UNIT_MULTIPLIER: Record<string, number> = {
  b: 1,
  byte: 1,
  bytes: 1,
  k: 1024,
  kb: 1024,
  ki: 1024,
  kib: 1024,
  m: 1024 ** 2,
  mb: 1024 ** 2,
  mi: 1024 ** 2,
  mib: 1024 ** 2,
  g: 1024 ** 3,
  gb: 1024 ** 3,
  gi: 1024 ** 3,
  gib: 1024 ** 3,
  t: 1024 ** 4,
  tb: 1024 ** 4,
  ti: 1024 ** 4,
  tib: 1024 ** 4,
};

/** Parse size strings such as "5.13 KB", "1.2Gi", "100 MiB" into bytes. */
export function parseStorageSizeToBytes(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;
  const m = raw.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]*)$/);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = (m[2] || 'b').toLowerCase();
  const mult = BYTE_UNIT_MULTIPLIER[unit];
  if (mult == null || Number.isNaN(n)) return null;
  return n * mult;
}

export function formatBytesCompact(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  let v = bytes;
  let u = 0;
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024;
    u += 1;
  }
  const decimals = u === 0 ? 0 : 2;
  return `${v.toFixed(decimals)} ${units[u]}`;
}

export interface AggregateSnapshotStorageResult {
  usedBytes: number;
  totalBytes: number | null;
  percentUsed: number | null;
  availableLabel?: string;
  totalLabel?: string;
}

/** Sum snapshot sizes; use first parseable PVC total / available labels from the list. */
export function buildAggregateSnapshotStorage(
  snapshots: ApplicationSnapshotSummary[],
): AggregateSnapshotStorageResult {
  let usedBytes = 0;
  for (const s of snapshots) {
    const b = parseStorageSizeToBytes(s.size);
    if (b != null) usedBytes += b;
  }

  let totalBytes: number | null = null;
  let totalLabel: string | undefined;
  let availableLabel: string | undefined;

  for (const s of snapshots) {
    if (s.pvcTotal && totalBytes == null) {
      const t = parseStorageSizeToBytes(s.pvcTotal);
      if (t != null) {
        totalBytes = t;
        totalLabel = s.pvcTotal;
      }
    }
    if (s.pvcAvailable && availableLabel === undefined) {
      availableLabel = s.pvcAvailable;
    }
    if (totalBytes != null && availableLabel !== undefined) break;
  }

  let percentUsed: number | null = null;
  if (totalBytes != null && totalBytes > 0) {
    percentUsed = Math.min(100, Math.max(0, (usedBytes / totalBytes) * 100));
  }

  return { usedBytes, totalBytes, percentUsed, availableLabel, totalLabel };
}
