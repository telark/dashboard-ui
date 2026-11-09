import { Endpoints } from '../../constants';
import type { AuthConfigData } from '../../features/auth/models';
import type { ResolvedRole } from '../../features/auth/models/permissions';
import { mockEndpoint } from '../api';

/** The public sign-in settings the login and register pages read. Self-registration is on. */
export const mockAuthConfig = (config: Partial<AuthConfigData> = {}) =>
  mockEndpoint('auth', Endpoints.AUTH.CONFIG.GET, {
    data: { selfRegistrationEnabled: true, oidcEnabled: false, ...config },
  });

/** The signed-in user's resolved permissions. */
export const mockMyPermissions = (userID = 'user-1', roles: ResolvedRole[] = []) =>
  mockEndpoint('auth', Endpoints.AUTH.PERMISSIONS.GET, { userID, roles: roles as never });
