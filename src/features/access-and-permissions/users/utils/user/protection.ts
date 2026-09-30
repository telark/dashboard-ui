import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';

// Why Delete and Suspend are off for this target, mirroring the backend refusals.
export const userLockReason = (target: User, viewer: User | null): string | undefined => {
  if (target.id === viewer?.id) return UC.LABELS.ACTIONS.SELF_LOCKED_TOOLTIP;
  if (target.bootstrap) return UC.LABELS.ACTIONS.BOOTSTRAP_LOCKED_TOOLTIP;
  return undefined;
};
