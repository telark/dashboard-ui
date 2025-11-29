export const convertAssignedToToAPI = (
  assignedTo?: string[],
): { groupIDs: string[]; userIDs: string[] } => {
  const groupIDs: string[] = [];
  const userIDs: string[] = [];

  if (assignedTo && assignedTo.length > 0) {
    assignedTo.forEach((item) => {
      if (item.startsWith('group-')) {
        groupIDs.push(item.replace('group-', ''));
      } else if (item.startsWith('user-')) {
        userIDs.push(item.replace('user-', ''));
      }
    });
  }

  // Always return an object, even if empty, to allow clearing assignments
  return { groupIDs, userIDs };
};

export const convertAssignedToFromAPI = (assignedTo?: {
  groupIDs?: string[];
  userIDs?: string[];
}): string[] => {
  if (!assignedTo) {
    return [];
  }

  const result: string[] = [];
  if (assignedTo.groupIDs) {
    result.push(...assignedTo.groupIDs.map((id) => `group-${id}`));
  }
  if (assignedTo.userIDs) {
    result.push(...assignedTo.userIDs.map((id) => `user-${id}`));
  }
  return result;
};
