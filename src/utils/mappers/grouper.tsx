import { Maintenance } from '../../interfaces/grouper';

export const mapGroupersData = (data: any): any[] => {
  if (data?.status !== 200 || !data.data?.items?.length) {
    throw new Error('Invalid data format from the API');
  }

  return data.data.items.map((item: any) => {
    return {
      name: item.fasid?.sourceName || 'Unknown',
      status: item.cacid?.status || 'Unknown',
      numberOfWorkloads: item.cacid?.workloads?.length || 0,
      numberOfBridges: item.cacid?.bridges?.length || 0,
      creationTime: item.fasid?.creationTime || '',
      lastUpdateTime: item.config?.sync?.lastUpdateTime || '',
      history: item.config?.history || [],
      workloads: item.cacid?.workloads || [],
      bridges: item.cacid?.bridges || [],
      sync: item.config?.sync || null,
      hasMaintenance: Boolean(item.config?.maintenance),
    };
  });
};

export const mapSingleGrouperData = (item: any, maintenance: Maintenance | null): any => {
  // New API shape: { facid: {...}, cacid: {...} } without config
  if (!item || !item.fasid || !item.cacid || !item.config) {
    throw new Error('Missing expected data in the response.');
  }

  return {
    name: item.fasid.name,
    kind: item.fasid.type,
    status: item.cacid.status || 'Unknown',
    numberOfWorkloads: item.cacid.workloads?.length || 0,
    numberOfBridges: item.cacid.bridges?.length || 0,
    creationTime: item.fasid.creationTime,
    lastUpdateTime: item.config?.sync?.lastUpdateTime || item.fasid.lastUpdateTime,
    history: item.config?.history || [],
    workloads: item.cacid?.workloads || [],
    bridges: item.cacid?.bridges || [],
    sync: item.config?.sync || null,
    hasMaintenance: Boolean(item.config?.maintenance),
    maintenance: maintenance,
  };
};

export const mapGrouperMaintenanceData = (item: any): any => {
  if (!item) {
    throw new Error('Missing expected data in the response.');
  }

  return {
    name: item.name,
    status: item.status,
    deleteAction: item.delete,
    updateAction: item.update,
  };
};
