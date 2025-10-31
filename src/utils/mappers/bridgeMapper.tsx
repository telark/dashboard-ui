import { UTILS_TEXTS, HTTP_STATUS, CARD_DEFAULTS } from '../../constants';

export const mapBridgesData = (data: any): any[] => {
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
      type: item.cacid?.type || item.fasid?.type || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
      grouper: item.fasid?.grouper || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
      sourceName: item.fasid?.sourceName || CARD_DEFAULTS.GROUPER.NAME,
      sourceType: item.fasid?.sourceType || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
      creationTime: item.fasid?.creationTime || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
      lastUpdateTime: item.config?.sync?.lastUpdateTime || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
      history: item.config?.history || [],
      ports: item.cacid?.ports || [],
      selectors: item.cacid?.selectors || [],
      workloads: item.cacid?.workloads || [],
      sync: item.config?.sync || null,
    };
  });
};

export const mapSingleBridgeData = (item: any): any => {
  if (!item || !item.fasid || !item.cacid || !item.config) {
    throw new Error(UTILS_TEXTS.ERRORS.MISSING_DATA);
  }

  return {
    name: item.fasid.sourceName,
    syncName: item.fasid.name,
    status: item.cacid.status || CARD_DEFAULTS.GROUPER.STATUS,
    type: item.cacid.type || item.fasid.type || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
    grouper: item.fasid.grouper || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
    sourceName: item.fasid.sourceName,
    sourceType: item.fasid.sourceType || UTILS_TEXTS.DEFAULTS.EMPTY_STRING,
    creationTime: item.fasid.creationTime,
    lastUpdateTime: item.config?.sync?.lastUpdateTime || item.fasid.lastUpdateTime,
    history: item.config?.history || [],
    ports: item.cacid?.ports || [],
    selectors: item.cacid?.selectors || [],
    workloads: item.cacid?.workloads || [],
    sync: item.config?.sync || null,
  };
};

