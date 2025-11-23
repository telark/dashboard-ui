import { GROUPERS_CONSTANTS } from '../../features/groupers/constants';

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

const resetRetryState = (callbacks: RetryCallbacks): void => {
  callbacks.setRetrying?.(false);
  callbacks.setRetryCount?.(0);
  callbacks.setNextRetryIn?.(0);
};

const handleRetrySuccess = (callbacks: RetryCallbacks): void => {
  resetRetryState(callbacks);
  callbacks.onSuccess?.();
};

const calculateDelay = (attempt: number, baseDelayMs: number, maxDelayMs: number): number => {
  return Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
};

const createCountdownTimer = (
  delay: number,
  countdownIntervalMs: number,
  onUpdate: (remaining: number) => void,
): ReturnType<typeof setInterval> => {
  let remainingTime = delay;
  const interval = setInterval(() => {
    remainingTime -= countdownIntervalMs;
    onUpdate(Math.max(0, remainingTime));

    if (remainingTime <= 0) {
      clearInterval(interval);
    }
  }, countdownIntervalMs);
  return interval;
};

const waitForDelay = (
  delay: number,
  timeoutRefs: { current: ReturnType<typeof setTimeout> | null }[],
): Promise<void> => {
  return new Promise((resolve) => {
    const timeoutRef = setTimeout(resolve, delay);
    timeoutRefs.push({ current: timeoutRef });
  });
};

const attemptRetry = async (
  retryFunction: () => Promise<boolean>,
  attempt: number,
  config: RetryConfig,
  callbacks: RetryCallbacks,
  timeoutRefs: { current: ReturnType<typeof setTimeout> | null }[],
): Promise<boolean> => {
  callbacks.setRetryCount?.(attempt + 1);

  const delay = calculateDelay(attempt, config.baseDelayMs, config.maxDelayMs);
  callbacks.setNextRetryIn?.(delay);

  const countdownInterval = createCountdownTimer(delay, config.countdownIntervalMs, (remaining) => {
    callbacks.setNextRetryIn?.(remaining);
  });

  await waitForDelay(delay, timeoutRefs);
  clearInterval(countdownInterval);

  try {
    const success = await retryFunction();
    if (success) {
      handleRetrySuccess(callbacks);
      return true;
    }
  } catch {
    // Continue to next attempt
  }
  return false;
};

const startCooldown = (
  config: RetryConfig,
  callbacks: RetryCallbacks,
  retryFunction: () => Promise<boolean>,
  timeoutRefs: { current: ReturnType<typeof setTimeout> | null }[],
): void => {
  resetRetryState(callbacks);
  callbacks.setInCooldown?.(true);
  callbacks.setCooldownTime?.(config.cooldownDurationMs);

  let remainingCooldown = config.cooldownDurationMs;
  const cooldownInterval = setInterval(() => {
    remainingCooldown -= config.countdownIntervalMs;
    callbacks.setCooldownTime?.(Math.max(0, remainingCooldown));

    if (remainingCooldown <= 0) {
      clearInterval(cooldownInterval);
      callbacks.setInCooldown?.(false);
      callbacks.setCooldownTime?.(0);
      setTimeout(() => {
        createRetryHandler(retryFunction, callbacks, config)();
      }, GROUPERS_CONSTANTS.COOLDOWN.AUTO_RETRY_DELAY_MS);
    }
  }, config.countdownIntervalMs);

  const cooldownTimeout = setTimeout(() => {
    clearInterval(cooldownInterval);
  }, config.cooldownDurationMs);
  timeoutRefs.push({ current: cooldownTimeout });
};

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: GROUPERS_CONSTANTS.RETRY.MAX_ATTEMPTS,
  baseDelayMs: GROUPERS_CONSTANTS.RETRY.BASE_DELAY_MS,
  maxDelayMs: GROUPERS_CONSTANTS.RETRY.MAX_DELAY_MS,
  cooldownDurationMs: GROUPERS_CONSTANTS.COOLDOWN.DURATION_MS,
  countdownIntervalMs: GROUPERS_CONSTANTS.RETRY.COUNTDOWN_INTERVAL_MS,
};

export const createRetryHandler = (
  retryFunction: () => Promise<boolean>,
  callbacks: RetryCallbacks,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
) => {
  const timeoutRefs: { current: ReturnType<typeof setTimeout> | null }[] = [];

  return async (): Promise<void> => {
    callbacks.setRetrying?.(true);
    callbacks.setRetryCount?.(0);

    for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
      const success = await attemptRetry(retryFunction, attempt, config, callbacks, timeoutRefs);
      if (success) {
        return;
      }
    }

    startCooldown(config, callbacks, retryFunction, timeoutRefs);
    callbacks.onError?.();
  };
};

export const cancelRetry = (
  timeoutRefs: { current: ReturnType<typeof setTimeout> | null }[],
  callbacks: RetryCallbacks,
): void => {
  for (const ref of timeoutRefs) {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  }

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
