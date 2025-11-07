export const TIMEOUTS = {
  API: 10000, // 10 seconds
  WELCOME_SCREEN: 2000, // 2 seconds
  AUTO_START_ANALYZE: 5000, // 5 seconds
  POLLING_BREAK: 5000, // 5 seconds after 4 consecutive failures
} as const;

export const POLLING_DELAYS = {
  SEQUENCE: [2000, 4000, 8000, 12000, 20000, 30000], // Exponential backoff delays in ms
  MAX_FAILURES: 4, // Number of consecutive failures before break
} as const;
