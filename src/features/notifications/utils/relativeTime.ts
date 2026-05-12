export const toDate = (value: string | number | Date): Date => {
  return value instanceof Date ? value : new Date(value);
};
