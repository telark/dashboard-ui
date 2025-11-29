export const convertAssignedToToAPI = (
  assignedTo?: string[],
): { groupIDs: string[]; userIDs: string[] } | undefined => {
  if (!assignedTo || assignedTo.length === 0) {
    return undefined;
  }

  const groupIDs: string[] = [];
  const userIDs: string[] = [];

  assignedTo.forEach((item) => {
    if (item.startsWith('group-')) {
      groupIDs.push(item.replace('group-', ''));
    } else if (item.startsWith('user-')) {
      userIDs.push(item.replace('user-', ''));
    }
  });

  if (groupIDs.length === 0 && userIDs.length === 0) {
    return undefined;
  }

  const result: { groupIDs?: string[]; userIDs?: string[] } = {};
  if (groupIDs.length > 0) {
    result.groupIDs = groupIDs;
  }
  if (userIDs.length > 0) {
    result.userIDs = userIDs;
  }

  return result as { groupIDs: string[]; userIDs: string[] };
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
