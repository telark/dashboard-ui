import { Client } from '../api/index';

// API to fetch groupers
export const fetchGroupers = async () => {
  const data = await Client<any>('scopes/groupers/fetch');
  return data;
};

// API to Fetch Grouper Details
export const fetchGrouperDetails = async (
  name: string,
) => {
  try {
    // API call to update the sync settings
    const response = await Client<any>(`scopes/groupers/${name}/fetch`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error("Failed to update sync settings:", error);
    throw error;
  }
};

// API to Update Sync Settings for a Grouper
export const updateGrouperSyncSettings = async (
  name: string, 
  syncMode: string,
) => {
  try {
    // API call to update the sync settings
    const response = await Client<any>(`scopes/groupers/${name}/sync/update`, {
      method: 'POST',
      data: {
        sync: {
          mode: syncMode,
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to update sync settings:", error);
    throw error;
  }
};

