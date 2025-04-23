import { Client, exporterApiClient } from '../api/index';

// Fetch Groupers API
export const fetchGroupers = async () => {
  const data = await Client<any>(
    exporterApiClient,
    'resources/groupers/get');
  return data;
};

// Fetch Grouper Details API
export const fetchGrouperDetails = async (
  name: string,
) => {
  try {
    const response = await Client<any>(
      exporterApiClient,
      `resources/groupers/${name}-grouper/get`, 
      {
        method: 'GET',
      });
    return response;
  } catch (error) {
    console.error("Failed to get grouper details", error);
    throw error;
  }
};

// Update Grouper Sync API
export const updateGrouperSyncMode = async (
  name: string, 
  syncMode: string,
) => {
  try {
    const response = await Client<any>(
      exporterApiClient,
      `resources/groupers/${name}-grouper/update/sync`, 
      {
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