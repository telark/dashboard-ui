import { Client } from '../api/index';

// API to fetch groupers
export const fetchGroupers = async () => {
  const data = await Client<any>('scopes/groupers/fetch');
  return data;
};

// API to update the sync settings for a grouper
export const updateSyncSettings = async (name: string, syncMode: string, syncPeriod: string) => {
  const response = await Client<any>(`scopes/groupers/${name}/update`, {
    method: 'POST',
    data: {
      syncMode,
      syncPeriod
    },
  });
  return response;
};
