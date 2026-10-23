import { ACTION_PERMISSIONS, usePermission } from '../../../auth/hooks';
import { getCurrentUser } from '../../../auth/utils';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';

const EDIT_OIDC_PERMISSION = ACTION_PERMISSIONS.settings.editOidcConfig;

interface SignInSettingsAccess {
  canEdit: boolean;
  deniedTooltip?: string;
  /** Not the bootstrap account: the card says so in text, not only on the disabled controls. */
  bootstrapOnly?: boolean;
}

// Whoever controls sign-in can mint a login for anyone, so auth takes these edits from the
// bootstrap account only.
export const useSignInSettingsAccess = (): SignInSettingsAccess => {
  const canEditSettings = usePermission(
    EDIT_OIDC_PERMISSION.scope,
    EDIT_OIDC_PERMISSION.level,
    EDIT_OIDC_PERMISSION.deny,
  );
  if (getCurrentUser()?.bootstrap !== true) {
    return { canEdit: false, deniedTooltip: C.LABELS.BOOTSTRAP_ONLY, bootstrapOnly: true };
  }
  return canEditSettings
    ? { canEdit: true }
    : { canEdit: false, deniedTooltip: C.LABELS.PERMISSION_DENIED };
};
