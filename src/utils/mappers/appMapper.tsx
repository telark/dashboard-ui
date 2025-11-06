import { HTTP_STATUS, CARD_DEFAULTS } from '../../constants';
import type { AppWorkload, AppWorkloadCardData } from '../../interfaces/workload';
import { ParseGoTimeDate } from '../shared/time';

export const mapAppsWorkloadsData = (data: any): AppWorkloadCardData[] => {
  if (data?.status !== HTTP_STATUS.SUCCESS || !data?.data) {
    throw new Error('Invalid data format');
  }

  const items = Array.isArray(data.data.items) ? data.data.items : [];
  if (items.length === 0) return [];

  return items.map((item: AppWorkload) => {
    return {
      name: item.fasid?.name || CARD_DEFAULTS.GROUPER.NAME,
      sourceName: item.fasid?.sourceName || CARD_DEFAULTS.GROUPER.NAME,
      grouper: item.fasid?.grouper || 'Unknown',
      status: item.cacid?.status || CARD_DEFAULTS.GROUPER.STATUS,
      instances: {
        total: item.cacid?.instances?.total || 0,
        available: item.cacid?.instances?.available || 0,
      },
      containers:
        (item.cacid?.crates?.regular?.length || 0) + (item.cacid?.crates?.init?.length || 0),
      bridges: item.cacid?.bridges?.length || 0,
      lastUpdate: ParseGoTimeDate(
        item.config?.sync?.lastUpdateTime || item.fasid?.creationTime || 'Unknown',
      ),
      sourceType: item.fasid?.sourceType || 'Unknown',
      registry: item.cacid?.registry || 'Unknown',
      strategy: item.cacid?.strategy || 'Unknown',
      creationTime: item.fasid?.creationTime
        ? ParseGoTimeDate(item.fasid.creationTime)
        : undefined,
      sync: item.config?.sync,
    };
  });
};

export const mapSingleAppWorkloadData = (item: AppWorkload): AppWorkload => {
  if (!item || !item.fasid || !item.cacid) {
    throw new Error('Missing workload data');
  }

  return {
    fasid: {
      creationTime: ParseGoTimeDate(item.fasid.creationTime || 'Unknown'),
      grouper: item.fasid.grouper || 'Unknown',
      name: item.fasid.name || 'Unknown',
      sourceName: item.fasid.sourceName || 'Unknown',
      sourceType: item.fasid.sourceType || 'Unknown',
      type: item.fasid.type || 'Unknown',
    },
    cacid: {
      status: item.cacid.status || CARD_DEFAULTS.GROUPER.STATUS,
      metadata: item.cacid.metadata || {
        annotations: [],
        labels: { global: [], selector: [] },
      },
      strategy: item.cacid.strategy || 'Unknown',
      instances: {
        total: item.cacid.instances?.total || 0,
        available: item.cacid.instances?.available || 0,
        names: item.cacid.instances?.names || [],
        labels: item.cacid.instances?.labels || [],
      },
      crates: {
        regular: item.cacid.crates?.regular || [],
        init: item.cacid.crates?.init || [],
      },
      registry: item.cacid.registry || 'Unknown',
      bridges: item.cacid.bridges || [],
      bridgeAttachmentPolicy: item.cacid.bridgeAttachmentPolicy || 'Unknown',
      events: item.cacid.events || [],
      usage: item.cacid.usage || {
        available: false,
        qos: 'Unknown',
        resources: {
          totalCpu: '0m',
          totalMemory: '0Mi',
          usagePerInstance: [],
        },
        timestamp: 'Unknown',
      },
    },
    config: {
      history: item.config?.history || [],
      sync: {
        lastUpdateTime: ParseGoTimeDate(item.config?.sync?.lastUpdateTime || 'Unknown'),
        mode: item.config?.sync?.mode || 'Unknown',
      },
    },
  };
};
