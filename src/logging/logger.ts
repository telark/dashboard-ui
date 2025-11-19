import log from 'loglevel';
import { getLoggerConfig } from './logger.config';
import { LOG_LEVEL_NAMES } from './levels';
import type { LogLevelName } from './levels';

const configureLogger = (): void => {
  const config = getLoggerConfig();

  log.setLevel(config.level as log.LogLevelDesc);

  if (!config.enabled) {
    log.setLevel(LOG_LEVEL_NAMES.SILENT);
    return;
  }

  if (config.persistence.enabled && globalThis.window !== undefined) {
    try {
      const storedLevel = localStorage.getItem(config.persistence.storageKey);
      if (storedLevel && Object.values(LOG_LEVEL_NAMES).includes(storedLevel as LogLevelName)) {
        log.setLevel(storedLevel as log.LogLevelDesc);
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  if (config.persistence.enabled && globalThis.window !== undefined) {
    const originalSetLevel = log.setLevel.bind(log);
    log.setLevel = function (level: log.LogLevelDesc, persist?: boolean) {
      originalSetLevel(level, persist);
      try {
        localStorage.setItem(config.persistence.storageKey, String(level));
      } catch {
        // Silently fail if localStorage is not available
      }
    };
  }
};

configureLogger();

class EnhancedLogger {
  private formatMessage(message: string): string {
    const config = getLoggerConfig();
    let formattedMessage = message;

    // Add timestamp if enabled
    if (config.formatting.includeTimestamp) {
      const timestamp = new Date().toISOString();
      formattedMessage = `[${timestamp}] ${formattedMessage}`;
    }

    // Truncate message if max length is set
    if (
      config.formatting.maxMessageLength > 0 &&
      formattedMessage.length > config.formatting.maxMessageLength
    ) {
      formattedMessage = formattedMessage.substring(0, config.formatting.maxMessageLength) + '...';
    }

    return formattedMessage;
  }

  trace(message: string, ...args: unknown[]): void {
    log.trace(this.formatMessage(message), ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    log.debug(this.formatMessage(message), ...args);
  }

  info(message: string, ...args: unknown[]): void {
    log.info(this.formatMessage(message), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    log.warn(this.formatMessage(message), ...args);
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    const config = getLoggerConfig();
    let errorMessage = this.formatMessage(message);

    // Include stack trace if enabled and error is provided
    if (error) {
      if (error instanceof Error) {
        if (config.formatting.includeStackTrace && error.stack) {
          errorMessage += `\n${error.stack}`;
        } else {
          errorMessage += `\n${error.message}`;
        }
      } else if (typeof error === 'object' && error !== null) {
        try {
          errorMessage += `\n${JSON.stringify(error, null, 2)}`;
        } catch {
          errorMessage += `\n[Unable to stringify error object]`;
        }
      } else {
        errorMessage += `\n${String(error)}`;
      }
    }

    log.error(errorMessage, ...args);
  }

  setLevel(level: LogLevelName): void {
    log.setLevel(level as log.LogLevelDesc);
  }

  getLevel(): LogLevelName {
    const level = log.getLevel();
    const levelMap: Record<number, LogLevelName> = {
      0: LOG_LEVEL_NAMES.TRACE,
      1: LOG_LEVEL_NAMES.DEBUG,
      2: LOG_LEVEL_NAMES.INFO,
      3: LOG_LEVEL_NAMES.WARN,
      4: LOG_LEVEL_NAMES.ERROR,
      5: LOG_LEVEL_NAMES.SILENT,
    };
    return levelMap[level] ?? LOG_LEVEL_NAMES.SILENT;
  }

  enableAll(): void {
    log.enableAll();
  }

  disableAll(): void {
    log.disableAll();
  }
}

export const logger = new EnhancedLogger();
export default logger;
