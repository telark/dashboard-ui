export const API_CONFIG = {
  HOST: 'http://localhost',
  API_VERSION: 'v1',
  API_PREFIX: 'api',
} as const;

export const API_PORTS = {
  CONFIGURATOR: 8001,
  EXPORTER: 8002,
  SYNC_MANAGER: 8004,
} as const;

/**
 * Helper function to build API base URL
 */
export const buildApiUrl = (port: number): string => {
  return `${API_CONFIG.HOST}:${port}/${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}`;
};
