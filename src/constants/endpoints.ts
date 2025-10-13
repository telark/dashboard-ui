import {
  API_PATHS,
  RESOURCE_PATHS,
  INSIGHT_PATHS,
  MAINTENANCE_PATHS,
  ANALYZE_PATHS,
} from './paths';

export const Endpoints = {
  GROUPERS: {
    GET_ALL: {
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_DETAILS: (name: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.GET_DETAILS(name)}`,
      method: 'GET',
    }),
    UPDATE_SYNC: (name: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
      method: 'PATCH',
    }),
  },
  INSIGHTS: {
    CLUSTER_GET: {
      path: `${API_PATHS.RESOURCES.INSIGHTS}/${INSIGHT_PATHS.CLUSTER_GET}`,
      method: 'GET',
    },
  },
  ANALYZE: {
    START: {
      path: `${API_PATHS.ANALYZE}/${ANALYZE_PATHS.START}`,
      method: 'POST',
    },
  },
  SYNC: {
    GROUPERS: {
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.SYNC}`,
      method: 'POST',
    },
    GROUPER: (name: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.SYNC_GROUPER(name)}`,
      method: 'POST',
    }),
  },
  GROUPER_MAINTENANCE: {
    CHECK: (name: string) => ({
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.CHECK(name)}`,
      method: 'GET',
    }),
    ENABLE: {
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.ENABLE}`,
      method: 'POST',
    },
    UPDATE: {
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.UPDATE}`,
      method: 'PUT',
    },
    REMOVE: {
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.REMOVE}`,
      method: 'DELETE',
    },
  },
  WORKLOADS: {
    APPS: {
      GET_ALL_APPS: {
        path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.GET_ALL}`,
        method: 'GET',
      },
      GET_APP_DETAILS: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.GET_DETAILS(name)}`,
        method: 'GET',
      }),
      UPDATE_APP_SYNC: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
        method: 'PATCH',
      }),
    },
    BATCHES: {
      GET_ALL_BATCHES: {
        path: `${API_PATHS.RESOURCES.WORKLOADS}/batches/${RESOURCE_PATHS.GET_ALL}`,
        method: 'GET',
      },
      GET_BATCH_DETAILS: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/batches/${RESOURCE_PATHS.GET_DETAILS(name)}`,
        method: 'GET',
      }),
      UPDATE_BATCH_SYNC: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/batches/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
        method: 'PATCH',
      }),
    },
  },
};
