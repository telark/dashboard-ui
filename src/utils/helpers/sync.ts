import { SYNC_MESSAGES } from '../../constants/layout/modes';
import { SyncConfig } from '../../interfaces/sync';

export const getDetailsPollingEffects = (config: SyncConfig): readonly string[] => {
  return config.detailsConstants?.SYNC.POLLING_EFFECTS || config.cardConstants.POLLING_EFFECTS;
};

export const getCardPollingEffects = (config: SyncConfig): readonly string[] => {
  return config.cardConstants.POLLING_EFFECTS;
};

export const getDetailsPollingInterval = (config: SyncConfig): number => {
  return config.detailsConstants?.SYNC.POLLING.INTERVAL_MS || config.cardConstants.POLLING.INTERVAL_MS;
};

export const getCardPollingInterval = (config: SyncConfig): number => {
  return config.cardConstants.POLLING.INTERVAL_MS;
};

export const getDetailsPollingMaxWait = (config: SyncConfig): number => {
  return config.detailsConstants?.SYNC.POLLING.MAX_WAIT_MS || config.cardConstants.POLLING.MAX_WAIT_MS;
};

export const getCardPollingMaxWait = (config: SyncConfig): number => {
  return config.cardConstants.POLLING.MAX_WAIT_MS;
};

export const getDetailsSuccessDuration = (config: SyncConfig): number => {
  return config.detailsConstants?.SYNC.MESSAGE_DURATIONS.SUCCESS ||
    config.cardConstants.MESSAGE_DURATIONS.SUCCESS;
};

export const getCardSuccessDuration = (config: SyncConfig): number => {
  return config.cardConstants.MESSAGE_DURATIONS.SUCCESS;
};

export const getDetailsTimeoutMessage = (config: SyncConfig): string => {
  return config.detailsConstants?.SYNC.TIMEOUT_MESSAGE || config.cardTimeoutMessage;
};

export const getDetailsErrorKey = (config: SyncConfig): string => {
  return config.detailsConstants?.SYNC.ERROR_KEY || config.cardConstants.ERROR_KEY;
};

export const getDetailsErrorDuration = (config: SyncConfig): number => {
  return config.detailsConstants?.SYNC.MESSAGE_DURATIONS.ERROR ||
    config.cardConstants.MESSAGE_DURATIONS.ERROR;
};

export const getCardTimeoutMessage = (config: SyncConfig): string => {
  return config.cardTimeoutMessage;
};

export const getCardErrorKey = (config: SyncConfig): string => {
  return config.cardConstants.ERROR_KEY;
};

export const getCardErrorDuration = (config: SyncConfig): number => {
  return config.cardConstants.MESSAGE_DURATIONS.ERROR;
};

export const getMessageForEffect = (effect: string, config?: SyncConfig): string => {
  // Make NotFound message generic instead of grouper-specific
  if (effect === 'NotFound') {
    return 'This resource is being removed and will disappear shortly.';
  }
  return SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
};

export const getErrorMessage = (err: any, config: SyncConfig, getTimeoutMessageFn: () => string): string => {
  const meta = err?.normalized as { isTimeout?: boolean } | undefined;
  const phase = err?.response?.data?.data?.phase as string | undefined;
  const effect = err?.response?.data?.data?.syncEffect as string | undefined;

  if (meta?.isTimeout) {
    return getTimeoutMessageFn();
  }

  if (phase && SYNC_MESSAGES.byPhase[phase]) {
    return SYNC_MESSAGES.byPhase[phase];
  }

  if (effect && SYNC_MESSAGES.byEffect[effect]) {
    return SYNC_MESSAGES.byEffect[effect];
  }

  return SYNC_MESSAGES.byPhase.Failed;
};

export const isResourceStillPresent = (
  resourceName: string,
  resourceList: any[],
  getNameFromResource: (resource: any) => string,
): boolean => {
  return resourceList.some((resource: any) => getNameFromResource(resource) === resourceName);
};

