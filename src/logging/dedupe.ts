import logger from './logger';

interface DedupeBucket {
  signature: string;
  loggedAt: number;
}

const buckets = new Map<string, DedupeBucket>();
const DEFAULT_WINDOW_MS = 30_000;

const buildSignature = (error: unknown): string => {
  if (error instanceof Error) return `${error.name}:${error.message}`;
  return String(error);
};

export const logErrorOnce = (
  scope: string,
  message: string,
  error: unknown,
  windowMs: number = DEFAULT_WINDOW_MS,
): void => {
  const signature = buildSignature(error);
  const now = Date.now();
  const bucket = buckets.get(scope);
  if (bucket && bucket.signature === signature && now - bucket.loggedAt < windowMs) {
    return;
  }
  buckets.set(scope, { signature, loggedAt: now });
  logger.error(message, error);
};

export const resetErrorDedupe = (scope: string): void => {
  buckets.delete(scope);
};
