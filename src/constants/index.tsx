export const DEFAULT_POLLING_INTERVAL = 60000; // 1 minute
export const DEFAULT_DATE_FORMAT = 'eee, d MMM yyyy';
export const DEFAULT_COLORS = {
  SUCCESS: '#20C997',
  ERROR: '#FF4D4F',
  DEFAULT: '#999',
  SWITCH_OFF: '#d9d9d9',
};

export const Endpoints = {
  GROUPERS: {
    GET_ALL: 'resources/groupers/get',
    GET_DETAILS: (name: string) => `resources/groupers/${name}/get`,
    UPDATE_SYNC: (name: string) => `resources/groupers/${name}/update/sync`,
  },
  MAINTENANCE: {
    CHECK: (name: string) => `feats/maintenance/${name}/get`,
    ENABLE: 'feats/maintenance/grouper/enable',
  },
};