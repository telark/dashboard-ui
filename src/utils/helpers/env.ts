import { ENV } from '../../constants/shared/utils';

export const isDevelopment = (): boolean => {
  const viteEnv = (import.meta as any)?.env;
  if (viteEnv?.DEV !== undefined) {
    return viteEnv.DEV;
  }

  // Fallback to Node.js environment check
  if (process !== undefined && process.env?.NODE_ENV !== undefined) {
    return process.env.NODE_ENV === ENV.DEV;
  }

  // Default to prod if neither is available
  return false;
};
