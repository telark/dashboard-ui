import { Client, configuratorApiClient } from '../api';
import { Endpoints } from '../constants/index';

// Enable Grouper Maintenance Mode
export const enableGrouperMaintenanceMode = async (
  grouperName: string,
  resourceType: string,
  updateAction: boolean,
  deleteAction: boolean
) => {
  try {
    return await Client<any>(configuratorApiClient, Endpoints.MAINTENANCE.ENABLE, {
      method: 'POST',
      data: {
        name: grouperName,
        type: resourceType,
        update: updateAction ? 'allow' : 'deny',
        delete: deleteAction ? 'allow' : 'deny',
      },
    });
  } catch (error) {
    console.error(`[APIClient] Failed to enable maintenance mode for "${grouperName}":`, error);
    throw error;
  }
};
