import { getCurrentSession } from '../../clients/session';
import { getCurrentUser } from './user';

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
