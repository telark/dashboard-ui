export const deepEqual = (obj1: unknown, obj2: unknown): boolean => {
  // Handle primitive values and same reference
  if (obj1 === obj2) return true;

  // Handle null/undefined
  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  // Handle different types
  if (typeof obj1 !== typeof obj2) return false;
  if (typeof obj1 !== 'object') return false;

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }

  // One is array, other is not
  if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

  // Handle objects
  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    const val1 = (obj1 as Record<string, unknown>)[key];
    const val2 = (obj2 as Record<string, unknown>)[key];
    return deepEqual(val1, val2);
  });
};

