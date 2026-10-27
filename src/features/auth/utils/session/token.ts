import { STORAGE_KEYS } from '../../../../constants/store/store';
import { getCurrentSession } from '../../clients/session';
import { logout } from '../../clients/logout';
import { purgeLocalUserData } from './cleanup';
import { getCurrentUser, removeCurrentUser } from './user';

// The session lives in an HttpOnly cookie no script can read, so "signed in" is the user a sign-in stored.
export const isSignedIn = (): boolean => getCurrentUser() !== null;

// The exporter names the session behind the cookie: that tells which listed device is this one.
export const getCurrentSessionName = async (): Promise<string | null> => {
  if (!isSignedIn()) return null;
  try {
    const response = await getCurrentSession();
    return response.data?.metadata?.name ?? null;
  } catch {
    return null;
  }
};

// Before 0.2.0 the token sat in localStorage, where any script could read it. Before the first render it is dropped
// with the stored user and the cached data (purged before rehydration, so nothing comes back), so everyone signs in
// once with no expired-session modal, and auth revokes it. Remove in 0.3.0, with STORAGE_KEYS.SESSION_TOKEN.
export const dropLegacySessionToken = (): void => {
  let token: string | null;
  try {
    token = globalThis.localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    if (token === null) return;
    globalThis.localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  } catch {
    return;
  }
  removeCurrentUser();
  purgeLocalUserData().catch(() => undefined);
  logout(token).catch(() => undefined);
};
