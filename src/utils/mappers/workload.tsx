import { HTTP_STATUS, CARD_DEFAULTS } from '../../constants';
import type { Workload, WorkloadCardData } from '../../interfaces/workload';

// Helper function to parse Go time.Date format
const parseGoTimeDate = (goTimeString: string): string => {
  if (!goTimeString || goTimeString === 'Unknown') {
    return new Date().toISOString();
  }

  // Handle Go time.Date format: time.Date(2025, time.September, 28, 12, 13, 1, 0, time.Local)
  const match = goTimeString.match(
    /time\.Date\((\d+),\s*time\.(\w+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*time\.Local\)/,
  );

  if (match) {
    const [, year, monthName, day, hour, minute, second] = match;

    // Convert month name to number
    const monthMap: { [key: string]: number } = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const month = monthMap[monthName] || 0;
    const date = new Date(
      parseInt(year),
      month,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    );
    return date.toISOString();
  }

  // If it's already a valid ISO string, return as is
  try {
    new Date(goTimeString);
    return goTimeString;
  } catch {
    // Fallback to current time
    return new Date().toISOString();
  }
};

export const mapWorkloadsData = (data: any): WorkloadCardData[] => {
  if (data?.status !== HTTP_STATUS.SUCCESS || !data?.data) {
    throw new Error('Invalid data format');
  }

  const items = Array.isArray(data.data.items) ? data.data.items : [];
  if (items.length === 0) return [];

  return items.map((item: Workload) => {
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
      lastUpdate: parseGoTimeDate(
        item.config?.sync?.lastUpdateTime || item.fasid?.creationTime || 'Unknown',
      ),
      sourceType: item.fasid?.sourceType || 'Unknown',
      registry: item.cacid?.registry || 'Unknown',
      strategy: item.cacid?.strategy || 'Unknown',
    };
  });
};

export const mapSingleWorkloadData = (item: Workload): Workload => {
  if (!item || !item.fasid || !item.cacid) {
    throw new Error('Missing workload data');
  }

  return {
    fasid: {
      creationTime: parseGoTimeDate(item.fasid.creationTime || 'Unknown'),
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
        lastUpdateTime: parseGoTimeDate(item.config?.sync?.lastUpdateTime || 'Unknown'),
        mode: item.config?.sync?.mode || 'Unknown',
      },
    },
  };
};
