import { STORAGE_KEYS } from '../../constants';
import type { User } from '../../features/access-and-permissions/users/models';
import { buildUser } from '../factories/users';

/** Stores a signed-in user, as a finished login does, and returns it. */
export const signIn = (overrides: Partial<User> = {}): User => {
  const user = buildUser(overrides);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
};

/** An ISO timestamp `days` from now, negative for the past. */
export const inDays = (days: number): string =>
  new Date(Date.now() + days * 86_400_000).toISOString();
