export const API_TIMEOUT = 20000; //20 seconds

export const CONFIGURATOR_API = {
  HOST: 'http://localhost',
  PORT: 58553,
  API_VERSION: 'v1',
  get BASE_URL() {
    return `${this.HOST}:${this.PORT}/api/${this.API_VERSION}`;
  },
};

export const EXPORTER_API = {
  HOST: 'http://localhost',
  PORT: 58588,
  API_VERSION: 'v1',
  get BASE_URL() {
    return `${this.HOST}:${this.PORT}/api/${this.API_VERSION}`;
  },
};
