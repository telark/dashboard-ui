import { Client, exporterApiClient } from '../api/index';
import { Endpoints } from '../constants/index';

// Fetch all Groupers
export const fetchGroupers = async () => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.GROUPERS.GET_ALL);
  } catch (error) {
    console.error('[APIClient] Failed to fetch all groupers:', error);
    throw error;
  }
};
// Fetch specific Grouper Details
export const fetchGrouperDetails = async (name: string) => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.GROUPERS.GET_DETAILS(name), {
      method: 'GET',
    });
  } catch (error) {
    console.error(`[APIClient] Failed to fetch grouper details for "${name}":`, error);
    throw error;
  }
};

// Update Grouper Sync Mode
export const updateGrouperSyncMode = async (name: string, syncMode: string) => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.GROUPERS.UPDATE_SYNC(name), {
      method: 'POST',
      data: { sync: { mode: syncMode } },
    });
  } catch (error) {
    console.error(`[APIClient] Failed to update sync mode for "${name}":`, error);
    throw error;
  }
};

// Check Grouper Maintenance Mode
export const checkGrouperMaintenanceMode = async (name: string) => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.MAINTENANCE.CHECK(name), {
      method: 'GET',
    });
  } catch (error) {
    console.error(`[APIClient] Failed to fetch maintenance mode for "${name}":`, error);
    throw error;
  }
};
