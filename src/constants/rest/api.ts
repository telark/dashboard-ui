import { DEV_API_PORTS, buildApiUrl, buildBaseUrl } from '../rest/urls';

export const API_TIMEOUT = 30000; //30 seconds

export const EXPORTER_API = {
  PORT: DEV_API_PORTS.EXPORTER,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};

export const DISCOVERY_API = {
  PORT: DEV_API_PORTS.DISCOVERY,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};

export const AUTH_API = {
  PORT: DEV_API_PORTS.AUTH,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};

export const ENRICHMENT_API = {
  PORT: DEV_API_PORTS.ENRICHMENT,
  get BASE_URL() {
    return buildBaseUrl(this.PORT);
  },
};
