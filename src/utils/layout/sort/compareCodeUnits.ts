// For sorts no one reads (comparisons, keys): locale-free, so every machine orders alike.
export const compareCodeUnits = (a: string, b: string): number => (a < b ? -1 : Number(a > b));
