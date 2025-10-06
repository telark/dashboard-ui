import { Client, configuratorApiClient } from '../api';
import { Endpoints } from '../constants/endpoints';

// Enable Grouper Maintenance Mode
export const enableGrouperMaintenanceMode = async (
  grouperName: string,
  resourceType: string,
  updateAction: boolean,
  deleteAction: boolean,
) => {
  try {
    const { path, method } = Endpoints.GROUPER_MAINTENANCE.ENABLE;
    return await Client<any>(configuratorApiClient, path, {
      method: method,
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
  deleteAction: boolean,
) => {
  try {
    const { path, method } = Endpoints.GROUPER_MAINTENANCE.UPDATE;
    return await Client<any>(configuratorApiClient, path, {
      method: method,
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
export const removeGrouperMaintenanceMode = async (grouperName: string) => {
  try {
    const { path, method } = Endpoints.GROUPER_MAINTENANCE.REMOVE;
    return await Client<any>(configuratorApiClient, path, {
      method: method,
      data: {
        name: grouperName,
      },
    });
  } catch (error) {
    console.error(`[APIClient] Failed to remove maintenance mode for "${grouperName}":`, error);
    throw error;
  }
};

// Start cluster analysis
export const startClusterAnalyze = async () => {
  try {
    const { path, method } = Endpoints.ANALYZE.START;
    return await Client<any>(configuratorApiClient, path, { method });
  } catch (error) {
    console.error('[APIClient] Failed to start cluster analysis:', error);
    throw error;
  }
};
