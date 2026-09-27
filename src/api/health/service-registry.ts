import { ANALYZER_API, AUTH_API, DISCOVERY_API, EXPORTER_API } from '../../constants/rest/api';
import type { ServiceRegistryEntry } from '../types';
import { SERVICE_NAMES } from './constants';

const buildRegistry = (): readonly ServiceRegistryEntry[] => [
  { name: SERVICE_NAMES.EXPORTER, baseURLPattern: EXPORTER_API.BASE_URL },
  { name: SERVICE_NAMES.DISCOVERY, baseURLPattern: DISCOVERY_API.BASE_URL },
  { name: SERVICE_NAMES.AUTH, baseURLPattern: AUTH_API.BASE_URL },
  { name: SERVICE_NAMES.ANALYZER, baseURLPattern: ANALYZER_API.BASE_URL },
];

const getServiceRegistry = (): readonly ServiceRegistryEntry[] => buildRegistry();

const matches = (pattern: string | RegExp, url: string): boolean => {
  if (typeof pattern === 'string') return url.startsWith(pattern);
  return pattern.test(url);
};

export const resolveService = (url: string): string | null => {
  if (!url) return null;
  const entry = getServiceRegistry().find((e) => matches(e.baseURLPattern, url));
  return entry ? entry.name : null;
};
