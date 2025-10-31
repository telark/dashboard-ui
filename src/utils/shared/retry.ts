import { GROUPERS_PAGE_CONSTANTS } from '../../constants/pages/groupers';

export interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  nextRetryIn: number;
  isInCooldown: boolean;
  cooldownTime: number;
}

export interface RetryCallbacks {
  setRetrying: (retrying: boolean) => void;
  setRetryCount: (count: number) => void;
  setNextRetryIn: (time: number) => void;
  setInCooldown: (inCooldown: boolean) => void;
  setCooldownTime: (time: number) => void;
  onSuccess: () => void;
  onError: () => void;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  cooldownDurationMs: number;
  countdownIntervalMs: number;
}

/**
 * Creates a retry handler with exponential backoff and cooldown
 */
export const createRetryHandler = (
  retryFunction: () => Promise<boolean>,
  callbacks: RetryCallbacks,
  config: RetryConfig = {
    maxAttempts: GROUPERS_PAGE_CONSTANTS.RETRY.MAX_ATTEMPTS,
    baseDelayMs: GROUPERS_PAGE_CONSTANTS.RETRY.BASE_DELAY_MS,
    maxDelayMs: GROUPERS_PAGE_CONSTANTS.RETRY.MAX_DELAY_MS,
    cooldownDurationMs: GROUPERS_PAGE_CONSTANTS.COOLDOWN.DURATION_MS,
    countdownIntervalMs: GROUPERS_PAGE_CONSTANTS.RETRY.COUNTDOWN_INTERVAL_MS,
  },
) => {
  const timeoutRefs: { current: ReturnType<typeof setTimeout> | null }[] = [];

  return async (): Promise<void> => {
    if (callbacks.setRetrying) {
      callbacks.setRetrying(true);
    }
    if (callbacks.setRetryCount) {
      callbacks.setRetryCount(0);
    }

    for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
      if (callbacks.setRetryCount) {
        callbacks.setRetryCount(attempt + 1);
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(config.baseDelayMs * Math.pow(2, attempt), config.maxDelayMs);

      if (callbacks.setNextRetryIn) {
        callbacks.setNextRetryIn(delay);
      }

      // Countdown timer
      let remainingTime = delay;
      const countdownInterval = setInterval(() => {
        remainingTime -= config.countdownIntervalMs;
        if (callbacks.setNextRetryIn) {
          callbacks.setNextRetryIn(Math.max(0, remainingTime));
        }

        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
        }
      }, config.countdownIntervalMs);

      // Wait for delay
      await new Promise((resolve) => {
        const timeoutRef = setTimeout(resolve, delay);
        timeoutRefs.push({ current: timeoutRef });
      });

      clearInterval(countdownInterval);

      try {
        const success = await retryFunction();
        if (success) {
          if (callbacks.setRetrying) {
            callbacks.setRetrying(false);
          }
          if (callbacks.setRetryCount) {
            callbacks.setRetryCount(0);
          }
          if (callbacks.setNextRetryIn) {
            callbacks.setNextRetryIn(0);
          }
          if (callbacks.onSuccess) {
            callbacks.onSuccess();
          }
          return;
        }
      } catch {
        // Continue to next attempt
      }
    }

    // All retries failed - start cooldown
    if (callbacks.setRetrying) {
      callbacks.setRetrying(false);
    }
    if (callbacks.setRetryCount) {
      callbacks.setRetryCount(0);
    }
    if (callbacks.setNextRetryIn) {
      callbacks.setNextRetryIn(0);
    }
    if (callbacks.setInCooldown) {
      callbacks.setInCooldown(true);
    }
    if (callbacks.setCooldownTime) {
      callbacks.setCooldownTime(config.cooldownDurationMs);
    }

    // Start cooldown countdown
    let remainingCooldown = config.cooldownDurationMs;
    const cooldownInterval = setInterval(() => {
      remainingCooldown -= config.countdownIntervalMs;
      if (callbacks.setCooldownTime) {
        callbacks.setCooldownTime(Math.max(0, remainingCooldown));
      }

      if (remainingCooldown <= 0) {
        clearInterval(cooldownInterval);
        if (callbacks.setInCooldown) {
          callbacks.setInCooldown(false);
        }
        if (callbacks.setCooldownTime) {
          callbacks.setCooldownTime(0);
        }
        // Auto-retry after cooldown
        setTimeout(() => {
          createRetryHandler(retryFunction, callbacks, config)();
        }, GROUPERS_PAGE_CONSTANTS.COOLDOWN.AUTO_RETRY_DELAY_MS);
      }
    }, config.countdownIntervalMs);

    // Store interval reference for cleanup
    const cooldownTimeout = setTimeout(() => {
      clearInterval(cooldownInterval);
    }, config.cooldownDurationMs);
    timeoutRefs.push({ current: cooldownTimeout });

    if (callbacks.onError) {
      callbacks.onError();
    }
  };
};

/**
 * Cancels all active retry operations
 */
export const cancelRetry = (
  timeoutRefs: { current: ReturnType<typeof setTimeout> | null }[],
  callbacks: RetryCallbacks,
): void => {
  timeoutRefs.forEach((ref) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  });

  if (callbacks.setRetrying) {
    callbacks.setRetrying(false);
  }
  if (callbacks.setRetryCount) {
    callbacks.setRetryCount(0);
  }
  if (callbacks.setNextRetryIn) {
    callbacks.setNextRetryIn(0);
  }
  if (callbacks.setInCooldown) {
    callbacks.setInCooldown(false);
  }
  if (callbacks.setCooldownTime) {
    callbacks.setCooldownTime(0);
  }
};
