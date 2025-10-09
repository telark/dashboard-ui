import { Maintenance } from '../../interfaces/grouper';
import { UTILS_TEXTS, HTTP_STATUS, CARD_DEFAULTS } from '../../constants';

export const mapGroupersData = (data: any): any[] => {
  if (data?.status !== HTTP_STATUS.SUCCESS || !data?.data) {
    throw new Error(UTILS_TEXTS.ERRORS.INVALID_DATA_FORMAT);
  }

  const items = Array.isArray(data.data.items) ? data.data.items : [];
  if (items.length === 0) return [];

  return items.map((item: any) => {
    return {
      name: item.fasid?.sourceName || CARD_DEFAULTS.GROUPER.NAME,
      syncName: item.fasid?.name || item.fasid?.sourceName || CARD_DEFAULTS.GROUPER.NAME,
      status: item.cacid?.status || CARD_DEFAULTS.GROUPER.STATUS,
      numberOfWorkloads: item.cacid?.workloads?.length || UTILS_TEXTS.DEFAULTS.ZERO,
      numberOfBridges: item.cacid?.bridges?.length || UTILS_TEXTS.DEFAULTS.ZERO,
      creationTime: item.fasid?.creationTime || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
      lastUpdateTime: item.config?.sync?.lastUpdateTime || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
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
    throw new Error(UTILS_TEXTS.ERRORS.MISSING_DATA);
  }

  return {
    name: item.fasid.sourceName,
    syncName: item.fasid.name,
    kind: item.fasid.type,
    status: item.cacid.status || CARD_DEFAULTS.GROUPER.STATUS,
    numberOfWorkloads: item.cacid.workloads?.length || UTILS_TEXTS.DEFAULTS.ZERO,
    numberOfBridges: item.cacid.bridges?.length || UTILS_TEXTS.DEFAULTS.ZERO,
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
    throw new Error(UTILS_TEXTS.ERRORS.MISSING_DATA);
  }

  return {
    name: item.name,
    status: item.status,
    deleteAction: item.delete,
    updateAction: item.update,
  };
};
