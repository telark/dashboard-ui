import { Client, configuratorApiClient } from '../api/index';

// Enable Grouper Maintenance Mode API
export const enableGrouperMaintenanceMode = async (
  grouperName: string,
  resourceType: string,
  updateAction: boolean,
  deleteAction: boolean
) => {
  try {
    const response = await Client<any>(configuratorApiClient, `feats/maintenance/grouper/enable`, {
      method: 'POST',
      data: {
        name: grouperName,
        type: resourceType,
        update: updateAction ? 'allow' : 'deny',
        delete: deleteAction ? 'allow' : 'deny',
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to enable maintenance for grouper:', error);
    throw error;
  }
};
