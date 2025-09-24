export const Endpoints = {
  GROUPERS: {
    GET_ALL: { path: 'resources/groupers/get', method: 'GET' },
    GET_DETAILS: (name: string) => ({
      path: `resources/groupers/${name}/get`,
      method: 'GET',
    }),
    UPDATE_SYNC: (name: string) => ({
      path: `resources/groupers/${name}/patch`,
      method: 'PATCH',
    }),
  },
  SYNC: {
    GROUPERS: { path: 'resources/groupers/sync', method: 'POST' },
  },
  GROUPER_MAINTENANCE: {
    CHECK: (name: string) => ({ path: `feats/maintenance/${name}/get`, method: 'GET' }),
    ENABLE: { path: 'feats/maintenance/grouper/enable', method: 'POST' },
    UPDATE: { path: 'feats/maintenance/grouper/update', method: 'PUT' },
    REMOVE: { path: 'feats/maintenance/grouper/remove', method: 'DELETE' },
  },
};
