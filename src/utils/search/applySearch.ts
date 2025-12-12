export const applySearch = <T>(
  items: T[],
  searchTerm: string,
  fieldExtractors: Array<(item: T) => string | number | undefined | null>,
): T[] => {
  if (!searchTerm.trim()) {
    return items;
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return items.filter((item) => {
    return fieldExtractors.some((extractor) => {
      const value = extractor(item);
      if (value === undefined || value === null) {
        return false;
      }
      const normalizedValue = String(value).toLowerCase();
      return normalizedValue.includes(normalizedSearchTerm);
    });
  });
};
