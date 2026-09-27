export const FAILURE_THRESHOLD = 5;
export const WINDOW_MS = 10_000;
export const COOLDOWN_MS = 30_000;

export const SERVICE_NAMES = {
  EXPORTER: 'exporter',
  DISCOVERY: 'discovery',
  AUTH: 'auth',
  ANALYZER: 'analyzer',
} as const;
