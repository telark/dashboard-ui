import { fetchGroupById } from '../clients';

export const fetchFreshGroupIds = async (
  groupId: string,
  field: 'userRefs' | 'roleRefs',
): Promise<string[]> => (await fetchGroupById(groupId, true)).data?.[field] ?? [];
