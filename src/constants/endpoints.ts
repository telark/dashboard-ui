export const Endpoints = {
  GROUPERS: {
    GET_ALL: 'resources/groupers/get',
    GET_DETAILS: (name: string) => `resources/groupers/${name}/get`,
    UPDATE_SYNC: (name: string) => `resources/groupers/${name}/update/sync`,
  },
  GROUPER_MAINTENANCE: {
    CHECK: (name: string) => `feats/maintenance/${name}/get`,
    ENABLE: 'feats/maintenance/grouper/enable',
    UPDATE: 'feats/maintenance/grouper/update',
    REMOVE: 'feats/maintenance/grouper/remove',
  },
};
