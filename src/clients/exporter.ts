import { Client, exporterApiClient } from '../api/index';
import { Endpoints } from '../constants/endpoints';

// Fetch all Groupers
export const fetchGroupers = async () => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.GROUPERS.GET_ALL.path);
  } catch (error) {
    console.error('[APIClient] Failed to fetch all groupers:', error);
    throw error;
  }
};
// Fetch specific Grouper Details
export const fetchGrouperDetails = async (name: string) => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.GROUPERS.GET_DETAILS(name).path);
  } catch (error) {
    console.error(`[APIClient] Failed to fetch grouper details for "${name}":`, error);
    throw error;
  }
};

// Update Grouper Sync Mode
export const updateGrouperSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.GROUPERS.UPDATE_SYNC(name)
    return await Client<any>(exporterApiClient, path, {
      method: method,
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
    return await Client<any>(exporterApiClient, Endpoints.GROUPER_MAINTENANCE.CHECK(name).path);
  } catch (error) {
    console.error(`[APIClient] Failed to fetch maintenance mode for "${name}":`, error);
    throw error;
  }
};
