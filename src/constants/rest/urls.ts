export const API_CONFIG = {
  HOST: 'http://localhost',
  API_VERSION: 'v1',
  API_PREFIX: 'api',
} as const;

export const API_PORTS = {
  CONFIGURATOR: 8001,
  EXPORTER: 8002,
  DISCOVERY: 8004,
  AUTH: 8006,
  ENRICHMENT: 8007,
} as const;

export const buildApiUrl = (port: number): string => {
  return `${API_CONFIG.HOST}:${port}/${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}`;
};
