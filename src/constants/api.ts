import { API_PORTS, buildApiUrl } from './urls';

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

export const SYNC_MANAGER_API = {
  PORT: API_PORTS.SYNC_MANAGER,
  get BASE_URL() {
    return buildApiUrl(this.PORT);
  },
};
