export const HTTP_HEADERS = {
  CONTENT_TYPE: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    URL_ENCODED: 'application/x-www-form-urlencoded',
  },
  CUSTOM: {
    SILENT_404: 'X-Silent-404',
    SILENT_NETWORK: 'X-Silent-Network',
    SESSION_TOKEN: 'X-Session-Token',
    DEVICE_NAME: 'X-Device-Name',
    DEVICE_TYPE: 'X-Device-Type',
    USERNAME: 'X-Username',
    EMAIL: 'X-Email',
  },
  STANDARD: {
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    ACCEPT: 'Accept',
    IF_NONE_MATCH: 'If-None-Match',
    RETRY_AFTER: 'retry-after',
    ETAG: 'etag',
    ORIGIN: 'Origin',
    ACCESS_CONTROL_REQUEST_METHOD: 'Access-Control-Request-Method',
    ACCESS_CONTROL_REQUEST_HEADERS: 'Access-Control-Request-Headers',
  },
} as const;

export const HEADER_VALUES = {
  SILENT_404: 'true',
  SILENT_NETWORK: 'true',
} as const;
