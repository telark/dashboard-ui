export const normalizeValue = (value: unknown): unknown => {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) {
    const nonEmpty = value.filter((v) => v !== null && v !== undefined && v !== '');
    if (nonEmpty.length === 0) return undefined;
    if (nonEmpty.every((v) => typeof v === 'string')) {
      return nonEmpty.map((v) => (v as string).toLowerCase().trim()).sort();
    }
    return nonEmpty.map(normalizeValue);
  }
  if (typeof value === 'object') {
    const normalized: Record<string, unknown> = {};
    let hasValues = false;
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const normalizedVal = normalizeValue(val);
      if (normalizedVal !== undefined) {
        normalized[key] = normalizedVal;
        hasValues = true;
      }
    }
    return hasValues ? normalized : undefined;
  }
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

