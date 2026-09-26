import { fetchGroupById } from '../clients';

export const fetchFreshGroupIds = async (
  groupId: string,
  field: 'assignedUsersIDs' | 'assignedRolesIDs',
): Promise<string[]> => (await fetchGroupById(groupId, true)).data?.[field] ?? [];
