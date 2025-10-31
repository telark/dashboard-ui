export const API_PATHS = {
  RESOURCES: {
    GROUPERS: 'resources/groupers',
    INSIGHTS: 'resources/insights',
    WORKLOADS: 'resources/workloads',
  },
  FEATS: {
    MAINTENANCE: 'feats/maintenance',
  },
  ANALYZE: 'analyze',
} as const;

export const RESOURCE_PATHS = {
  GET_ALL: 'get',
  GET_DETAILS: (name: string) => `${name}/get`,
  UPDATE_SYNC: (name: string) => `${name}/patch`,
  SYNC: 'sync',
  SYNC_GROUPER: (name: string) => `${name}/sync`,
  SYNC_APP: (name: string) => `${name}/sync`,
} as const;

export const INSIGHT_PATHS = {
  CLUSTER_GET: 'cluster/get',
} as const;

export const MAINTENANCE_PATHS = {
  CHECK: (name: string) => `${name}/get`,
  ENABLE: 'grouper/enable',
  UPDATE: 'grouper/update',
  REMOVE: 'grouper/remove',
} as const;

export const ANALYZE_PATHS = {
  START: 'start',
} as const;
