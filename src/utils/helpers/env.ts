import { ENV } from '../../constants/shared/utils';

export const isDevelopment = (): boolean => {
  const viteEnv = import.meta.env;
  if (viteEnv?.DEV !== undefined) {
    return viteEnv.DEV;
  }

  if (process !== undefined && process.env?.NODE_ENV !== undefined) {
    return process.env.NODE_ENV === ENV.DEV;
  }

  return false;
};
