import { isDevelopment } from '../utils/helpers/env';
import { DEFAULT_LOG_LEVELS } from './levels';
import { LOGGER_CONFIG } from './config';
import type { LogLevelName } from './levels';

export interface LoggerConfig {
  level: LogLevelName;
  enabled: boolean;
  console: {
    enabled: boolean;
  };
  persistence: {
    enabled: boolean;
    storageKey: string;
  };
  formatting: {
    includeTimestamp: boolean;
    includeStackTrace: boolean;
    maxMessageLength: number;
  };
}

export const getLoggerConfig = (): LoggerConfig => {
  const isDev = isDevelopment();
  const enabled = isDev ? LOGGER_CONFIG.ENABLE_IN_DEVELOPMENT : LOGGER_CONFIG.ENABLE_IN_PRODUCTION;

  return {
    level: isDev ? DEFAULT_LOG_LEVELS.DEVELOPMENT : DEFAULT_LOG_LEVELS.PRODUCTION,
    enabled,
    console: {
      enabled: LOGGER_CONFIG.ENABLE_CONSOLE && enabled,
    },
    persistence: {
      enabled: LOGGER_CONFIG.PERSIST_LEVEL,
      storageKey: LOGGER_CONFIG.STORAGE_KEY,
    },
    formatting: {
      includeTimestamp: LOGGER_CONFIG.INCLUDE_TIMESTAMP,
      includeStackTrace: LOGGER_CONFIG.INCLUDE_STACK_TRACE,
      maxMessageLength: LOGGER_CONFIG.MAX_MESSAGE_LENGTH,
    },
  };
};
