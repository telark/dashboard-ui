import store, { RootState } from '../../store';
import {
  HandleSyncEffectParams,
  SyncConfig,
  MessageApi,
  DeletionPollingParams,
} from '../../interfaces/resources/sync';
import {
  getDetailsPollingEffects,
  getCardPollingEffects,
  getDetailsPollingInterval,
  getCardPollingInterval,
  getDetailsPollingMaxWait,
  getCardPollingMaxWait,
  getDetailsSuccessDuration,
  getCardSuccessDuration,
  getDetailsTimeoutMessage,
  getDetailsErrorKey,
  getDetailsErrorDuration,
  getCardTimeoutMessage,
  getCardErrorKey,
  getCardErrorDuration,
  getMessageForEffect,
  getErrorMessage,
  isResourceStillPresent,
} from '../helpers/sync';


const handleDeletionPolling = ({
  resourceName,
  effect,
  key,
  config,
  message,
  getPollingMaxWait,
  getPollingInterval,
  getSuccessDuration,
}: DeletionPollingParams): void => {
  store.dispatch(config.fetchAllResourcesThunk());

  const start = Date.now();
  const waitMs = getPollingMaxWait(config);
  const intervalMs = getPollingInterval(config);
  const duration = getSuccessDuration(config);
  const friendlyMessage = getMessageForEffect(effect);

  const interval = setInterval(() => {
    const state: RootState = store.getState();
    const resourceList = config.getResourceList(state);
    const stillThere = isResourceStillPresent(
      resourceName,
      resourceList,
      config.getNameFromResource,
    );

    if (!stillThere || Date.now() - start > waitMs) {
      clearInterval(interval);
      message.open({
        type: 'success',
        content: friendlyMessage,
        key,
        duration,
      });
    }
  }, intervalMs);
};

// Handle refresh for non-deletion effects (Changed, NewlyCreated, NoUpdate) - Details sync
const handleDetailsRefreshEffect = async (
  resourceName: string | undefined,
  effect: string,
  key: string,
  config: SyncConfig,
  message: HandleSyncEffectParams['message'],
): Promise<void> => {
  if (resourceName) {
    await store.dispatch(config.fetchResourceDetailsThunk(resourceName));
  }

  const duration = getDetailsSuccessDuration(config);
  const friendlyMessage = getMessageForEffect(effect);

  message.open({
    type: 'success',
    content: friendlyMessage,
    key,
    duration,
  });
};

// Handle refresh for non-deletion effects (Changed, NewlyCreated, NoUpdate) - Card sync
const handleCardRefreshEffect = async (
  resourceName: string | undefined,
  effect: string,
  key: string,
  config: SyncConfig,
  message: HandleSyncEffectParams['message'],
): Promise<void> => {
  if (resourceName) {
    await store.dispatch(config.fetchResourceDetailsThunk(resourceName));
  }

  const duration = getCardSuccessDuration(config);
  const friendlyMessage = getMessageForEffect(effect);

  message.open({
    type: 'success',
    content: friendlyMessage,
    key,
    duration,
  });
};

export const handleSyncEffect = async ({
  effect,
  resourceDetails,
  name,
  key,
  message,
  config,
}: HandleSyncEffectParams): Promise<void> => {
  const resourceName = config.getNameFromResource(resourceDetails) || name || '';
  const isDetailsSync = !!resourceDetails;
  const pollingEffects = isDetailsSync
    ? getDetailsPollingEffects(config)
    : getCardPollingEffects(config);

  if (pollingEffects.includes(effect)) {
    if (!resourceName) {
      // If no resource name, fall back to refresh logic
      if (isDetailsSync) {
        await handleDetailsRefreshEffect(undefined, effect, key, config, message);
      } else {
        await handleCardRefreshEffect(undefined, effect, key, config, message);
      }
      return;
    }
    if (isDetailsSync) {
      handleDeletionPolling({
        resourceName,
        effect,
        key,
        config,
        message,
        getPollingMaxWait: getDetailsPollingMaxWait,
        getPollingInterval: getDetailsPollingInterval,
        getSuccessDuration: getDetailsSuccessDuration,
      });
    } else {
      handleDeletionPolling({
        resourceName,
        effect,
        key,
        config,
        message,
        getPollingMaxWait: getCardPollingMaxWait,
        getPollingInterval: getCardPollingInterval,
        getSuccessDuration: getCardSuccessDuration,
      });
    }
    return;
  }
  if (isDetailsSync) {
    await handleDetailsRefreshEffect(resourceName || undefined, effect, key, config, message);
  } else {
    await handleCardRefreshEffect(resourceName || undefined, effect, key, config, message);
  }
};

export const handleSyncError = ({
  err,
  message,
  config,
  isDetailsSync = true,
}: {
  err: any;
  message: MessageApi;
  config: SyncConfig;
  isDetailsSync?: boolean;
}): void => {
  const getTimeoutMessage = isDetailsSync ? getDetailsTimeoutMessage : getCardTimeoutMessage;
  const getErrorKey = isDetailsSync ? getDetailsErrorKey : getCardErrorKey;
  const getErrorDuration = isDetailsSync ? getDetailsErrorDuration : getCardErrorDuration;

  const friendly = getErrorMessage(err, config, () => getTimeoutMessage(config));
  const errorKey = getErrorKey(config);
  const duration = getErrorDuration(config);

  message.open({
    type: 'error',
    content: friendly,
    key: errorKey,
    duration,
  });
};
