import { STORAGE_KEYS } from '../../constants/store/store';
import type { User } from '../../interfaces/auth';

export const getCurrentUser = (): User | null => {
  try {
    const userStr = globalThis.sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to get current user:', error);
    }
  }
  return null;
};

export const setCurrentUser = (user: User): void => {
  try {
    globalThis.sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to set current user:', error);
    }
  }
};

export const removeCurrentUser = (): void => {
  try {
    globalThis.sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to remove current user:', error);
    }
  }
};

