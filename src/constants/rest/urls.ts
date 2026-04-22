const API_CONFIG = {
  LOCAL_HOST: 'http://localhost',
  API_VERSION: 'v1',
  API_PREFIX: 'api',
} as const;

export const DEV_API_PORTS = {
  EXPORTER: 8002,
  DISCOVERY: 8004,
  AUTH: 8006,
  ENRICHMENT: 8007,
} as const;

const PORT_TO_SERVICE: Readonly<Record<number, string>> = {
  [DEV_API_PORTS.EXPORTER]: 'exporter',
  [DEV_API_PORTS.DISCOVERY]: 'discovery',
  [DEV_API_PORTS.AUTH]: 'auth',
  [DEV_API_PORTS.ENRICHMENT]: 'enrichment',
};

declare const __IN_CLUSTER__: boolean;

const resolveService = (port: number): string => {
  const svc = PORT_TO_SERVICE[port];
  if (!svc) throw new Error(`Unknown port: ${port}`);
  return svc;
};

export const buildApiUrl = (port: number): string => {
  if (__IN_CLUSTER__) {
    const svc = resolveService(port);
    return `/${API_CONFIG.API_PREFIX}/${svc}/${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}`;
  }
  return `${API_CONFIG.LOCAL_HOST}:${port}/${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}`;
};

export const buildBaseUrl = (port: number): string => {
  if (__IN_CLUSTER__) {
    return `/${API_CONFIG.API_PREFIX}/${resolveService(port)}`;
  }
  return `${API_CONFIG.LOCAL_HOST}:${port}`;
};
