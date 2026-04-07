import { API_CONFIG, API_PORTS, buildApiUrl } from '../rest/urls';

export const API_TIMEOUT = 30000; //30 seconds

export const CONFIGURATOR_API = {
  PORT: API_PORTS.CONFIGURATOR,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};

export const EXPORTER_API = {
  PORT: API_PORTS.EXPORTER,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};

export const DISCOVERY_API = {
  PORT: API_PORTS.DISCOVERY,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};

export const AUTH_API = {
  PORT: API_PORTS.AUTH,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};

export const ENRICHMENT_API = {
  PORT: API_PORTS.ENRICHMENT,
  get BASE_URL() {
    return `${API_CONFIG.HOST}:${this.PORT}`;
  },
};
