import { compareCodeUnits } from '../../../../../utils/layout/sort';

const normalizeArray = (value: unknown[]): unknown => {
  const nonEmpty = value.filter((v) => v !== null && v !== undefined && v !== '');
  if (nonEmpty.length === 0) return undefined;
  if (nonEmpty.every((v) => typeof v === 'string')) {
    return nonEmpty.map((v) => v.toLowerCase().trim()).sort(compareCodeUnits);
  }
  return nonEmpty.map(normalizeValue);
};

const normalizeObject = (value: Record<string, unknown>): unknown => {
  const normalized: Record<string, unknown> = {};
  let hasValues = false;
  for (const [key, val] of Object.entries(value)) {
    const normalizedVal = normalizeValue(val);
    if (normalizedVal !== undefined) {
      normalized[key] = normalizedVal;
      hasValues = true;
    }
  }
  return hasValues ? normalized : undefined;
};

export const normalizeValue = (value: unknown): unknown => {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return normalizeArray(value);
  if (typeof value === 'object') return normalizeObject(value as Record<string, unknown>);
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};
