import { CARD_DEFAULTS, UTILS_TEXTS } from '../../../../constants';
import { ParseGoTimeDate } from '../../../../utils/shared/time';
import { extractItemsFromResponse } from '../../../../utils/helpers/api';

export const mapBridgesData = (data: any): any[] => {
  const items = extractItemsFromResponse(data);

  return items.map((item: any) => {
    return {
      name: item.fasid?.sourceName || CARD_DEFAULTS.GROUPER.NAME,
      syncName: item.fasid?.name || CARD_DEFAULTS.GROUPER.NAME,
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
  if (!item?.fasid || !item?.cacid || !item?.config) {
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
    creationTime: ParseGoTimeDate(
      item.fasid.creationTime || item.fasid.lastUpdateTime || new Date().toISOString(),
    ),
    lastUpdateTime:
      item.config?.sync?.lastUpdateTime || item.fasid.lastUpdateTime || new Date().toISOString(),
    history: item.config?.history || [],
    ports: item.cacid?.ports || [],
    selectors: item.cacid?.selectors || [],
    workloads: item.cacid?.workloads || [],
    sync: item.config?.sync || null,
  };
};

