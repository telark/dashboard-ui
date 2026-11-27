import { USERS_CONSTANTS as UC } from '../../constants';

// Why a member can't lose an assignment: the bootstrap account keeps its own, anyone else needs the right.
export const removalBlockedReason = (
  bootstrap: boolean | undefined,
  allowed: boolean,
  deniedTooltip: string,
): string | undefined => {
  if (bootstrap) return UC.LABELS.ACTIONS.BOOTSTRAP_LOCKED_TOOLTIP;
  return allowed ? undefined : deniedTooltip;
};
