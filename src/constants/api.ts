export const API_TIMEOUT = 10000; //10 seconds

export const CONFIGURATOR_API = {
  HOST: 'http://localhost',
  PORT: 8001,
  API_VERSION: 'v1',
  get BASE_URL() {
    return `${this.HOST}:${this.PORT}/api/${this.API_VERSION}`;
  },
};

export const EXPORTER_API = {
  HOST: 'http://localhost',
  PORT: 8002,
  API_VERSION: 'v1',
  get BASE_URL() {
    return `${this.HOST}:${this.PORT}/api/${this.API_VERSION}`;
  },
};

export const SYNC_MANAGER_API = {
  HOST: 'http://localhost',
  PORT: 8004,
  API_VERSION: 'v1',
  get BASE_URL() {
    return `${this.HOST}:${this.PORT}/api/${this.API_VERSION}`;
  },
};
