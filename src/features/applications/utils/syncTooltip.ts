import { APPLICATIONS_UI } from '../constants';

// A missing permission explains first; a running sync is the next reason an action is off.
export const syncBlockedTooltip = (
  allowed: boolean,
  deniedTooltip: string,
  syncing: boolean,
): string | undefined => {
  if (!allowed) return deniedTooltip;
  return syncing ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : undefined;
};
