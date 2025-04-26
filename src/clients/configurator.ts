import { Client, configuratorApiClient } from '../api';
import { Endpoints } from '../constants/endpoints';

// Enable Grouper Maintenance Mode
export const enableGrouperMaintenanceMode = async (
  grouperName: string,
  resourceType: string,
  updateAction: boolean,
  deleteAction: boolean
) => {
  try {
    return await Client<any>(configuratorApiClient, Endpoints.GROUPER_MAINTENANCE.ENABLE, {
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

// Update Grouper Maintenance Mode
export const updateGrouperMaintenanceMode = async (
  grouperName: string,
  updateAction: boolean,
  deleteAction: boolean
) => {
  try {
    return await Client<any>(configuratorApiClient, Endpoints.GROUPER_MAINTENANCE.UPDATE, {
      method: 'PUT',
      data: {
        name: grouperName,
        spec: {
          update: updateAction ? 'allow' : 'deny',
          delete: deleteAction ? 'allow' : 'deny',
        },
      },
    });
  } catch (error) {
    console.error(`[APIClient] Failed to update maintenance mode for "${grouperName}":`, error);
    throw error;
  }
};

// Remove Grouper Maintenance Mode
export const removeGrouperMaintenanceMode = async (
  grouperName: string,
) => {
  try {
    return await Client<any>(configuratorApiClient, Endpoints.GROUPER_MAINTENANCE.REMOVE, {
      method: 'DELETE',
      data: {
        name: grouperName,
      },
    });
  } catch (error) {
    console.error(`[APIClient] Failed to remove maintenance mode for "${grouperName}":`, error);
    throw error;
  }
};
