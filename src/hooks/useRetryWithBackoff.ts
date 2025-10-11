import { useState, useCallback, useRef } from 'react';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // in milliseconds
  maxDelay: number; // in milliseconds
  backoffMultiplier: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 5,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
};

export const useRetryWithBackoff = (config: Partial<RetryConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateDelay = useCallback((attempt: number): number => {
    const delay = finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, attempt);
    return Math.min(delay, finalConfig.maxDelay);
  }, [finalConfig]);

  const retryWithBackoff = useCallback(async (
    operation: () => Promise<any>,
    onSuccess?: () => void,
    onMaxRetriesReached?: () => void
  ) => {
    if (isRetrying) return;

    setIsRetrying(true);
    setRetryCount(0);

    const attemptRetry = async (attempt: number): Promise<void> => {
      if (attempt >= finalConfig.maxRetries) {
        setIsRetrying(false);
        onMaxRetriesReached?.();
        return;
      }

      setRetryCount(attempt);
      const delay = calculateDelay(attempt);
      setNextRetryIn(delay);

      // Start countdown
      let remainingTime = delay;
      const countdownInterval = setInterval(() => {
        remainingTime -= 1000;
        setNextRetryIn(Math.max(0, remainingTime));
        
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);

      // Wait for the delay
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, delay);
      });

      clearInterval(countdownInterval);

      try {
        await operation();
        setIsRetrying(false);
        setRetryCount(0);
        setNextRetryIn(0);
        onSuccess?.();
      } catch (error) {
        // Retry on next attempt
        attemptRetry(attempt + 1);
      }
    };

    try {
      await operation();
      setIsRetrying(false);
      setRetryCount(0);
      setNextRetryIn(0);
      onSuccess?.();
    } catch (error) {
      // Start retry attempts
      attemptRetry(1);
    }
  }, [isRetrying, finalConfig, calculateDelay]);

  const cancelRetry = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsRetrying(false);
    setRetryCount(0);
    setNextRetryIn(0);
  }, []);

  return {
    retryWithBackoff,
    isRetrying,
    retryCount,
    nextRetryIn,
    cancelRetry,
    maxRetries: finalConfig.maxRetries,
  };
};
