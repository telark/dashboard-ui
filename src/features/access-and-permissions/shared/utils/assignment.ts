// Applies what the user changed in a panel (opened from `initial`) onto the server's current
// list, so a stale panel never reverts someone else's edit and no id is sent twice.
export const applySelectionChange = (
  fresh: string[],
  initial: string[],
  selected: string[],
): string[] => {
  const removed = initial.filter((id) => !selected.includes(id));
  const added = selected.filter((id) => !initial.includes(id));
  return [...new Set([...fresh.filter((id) => !removed.includes(id)), ...added])];
};
