/**
 * Parses Kubernetes resource quantities ("250m", "1.5", "512Mi", "2Gi") into
 * comparable numbers. Returns null for anything unparseable so callers can fall
 * back to the raw string rather than render a wrong meter.
 */

const QUANTITY_PATTERN = /^(\d+(?:\.\d+)?(?:e[+-]?\d+)?)([a-zA-Z]*)$/;

/** Binary (Ki) and decimal (K) suffixes, per the Kubernetes quantity format. */
const MEMORY_MULTIPLIERS: Record<string, number> = {
  '': 1,
  Ki: 1024,
  Mi: 1024 ** 2,
  Gi: 1024 ** 3,
  Ti: 1024 ** 4,
  Pi: 1024 ** 5,
  k: 1000,
  K: 1000,
  M: 1000 ** 2,
  G: 1000 ** 3,
  T: 1000 ** 4,
  P: 1000 ** 5,
};

const CPU_MILLICORES_PER_CORE = 1000;
const MEMORY_UNIT_STEP = 1024;
const MEMORY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB'] as const;
const DECIMAL_PLACES = 1;

const matchQuantity = (raw: string | undefined | null): RegExpMatchArray | null => {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;
  return trimmed.match(QUANTITY_PATTERN);
};

/** CPU quantity to millicores: "250m" -> 250, "1.5" -> 1500. */
export const parseCpuToMillicores = (raw: string | undefined | null): number | null => {
  const match = matchQuantity(raw);
  if (!match) return null;
  const [, value, suffix] = match;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  if (suffix === 'm') return amount;
  if (suffix === '') return amount * CPU_MILLICORES_PER_CORE;
  return null;
};

/** Memory quantity to bytes: "512Mi" -> 536870912. */
export const parseMemoryToBytes = (raw: string | undefined | null): number | null => {
  const match = matchQuantity(raw);
  if (!match) return null;
  const [, value, suffix] = match;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  const multiplier = MEMORY_MULTIPLIERS[suffix];
  return multiplier == null ? null : amount * multiplier;
};

const roundQuantity = (value: number): string => `${Number(value.toFixed(DECIMAL_PLACES))}`;

const memoryUnitIndex = (bytes: number): number => {
  let value = bytes;
  let unitIndex = 0;
  while (value >= MEMORY_UNIT_STEP && unitIndex < MEMORY_UNITS.length - 1) {
    value /= MEMORY_UNIT_STEP;
    unitIndex += 1;
  }
  return unitIndex;
};

export const formatMillicores = (millicores: number): string =>
  millicores >= CPU_MILLICORES_PER_CORE
    ? roundQuantity(millicores / CPU_MILLICORES_PER_CORE)
    : `${Math.round(millicores)}m`;

export const formatBytes = (bytes: number): string => {
  const unitIndex = memoryUnitIndex(bytes);
  return `${roundQuantity(bytes / MEMORY_UNIT_STEP ** unitIndex)} ${MEMORY_UNITS[unitIndex]}`;
};

/** Usage and its scale in the scale's unit, each with it, so one line never mixes units: "6m / 50m". */
export const formatMillicoresPair = (used: number, scale: number): string =>
  scale >= CPU_MILLICORES_PER_CORE
    ? `${roundQuantity(used / CPU_MILLICORES_PER_CORE)} / ${roundQuantity(scale / CPU_MILLICORES_PER_CORE)}`
    : `${Math.round(used)}m / ${Math.round(scale)}m`;

export const formatBytesPair = (used: number, scale: number): string => {
  const unitIndex = memoryUnitIndex(scale);
  const divisor = MEMORY_UNIT_STEP ** unitIndex;
  const unit = MEMORY_UNITS[unitIndex];
  return `${roundQuantity(used / divisor)} ${unit} / ${roundQuantity(scale / divisor)} ${unit}`;
};
