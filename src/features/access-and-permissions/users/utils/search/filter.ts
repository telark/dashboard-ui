export const filterBySearchTerm = <T>(
  items: T[],
  searchTerm: string,
  getSearchFields: (item: T) => (string | undefined | null)[],
): T[] => {
  if (!searchTerm) return items;
  const lower = searchTerm.toLowerCase();
  return items.filter((item) =>
    getSearchFields(item).some((field) => field?.toLowerCase().includes(lower)),
  );
};
