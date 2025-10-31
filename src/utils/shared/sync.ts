import { SYNC_MESSAGES } from '../../constants/modes';
import store, { AppDispatch, RootState } from '../../store';
import { HandleSyncEffectParams, HandleSyncErrorParams } from '../../interfaces/sync';

export const handleSyncEffect = async ({
  effect,
  resourceDetails,
  name,
  key,
  message,
  config,
}: HandleSyncEffectParams): Promise<void> => {
  const resourceName = config.getNameFromResource(resourceDetails) || name;
  const isDetailsSync = !!resourceDetails;

  const pollingEffects = isDetailsSync
    ? config.detailsConstants?.SYNC.POLLING_EFFECTS || config.cardConstants.POLLING_EFFECTS
    : config.cardConstants.POLLING_EFFECTS;

  if (pollingEffects.includes(effect as 'Deleted' | 'NotFound')) {
    // For deletion effects, poll until resource is removed
    (store.dispatch as AppDispatch)(config.fetchAllResourcesThunk());

    const start = Date.now();
    const waitMs = isDetailsSync
      ? config.detailsConstants?.SYNC.POLLING.MAX_WAIT_MS || config.cardConstants.POLLING.MAX_WAIT_MS
      : config.cardConstants.POLLING.MAX_WAIT_MS;

    const interval = setInterval(
      () => {
        const state: RootState = store.getState();
        const resourceList = config.getResourceList(state);
        const stillThere = resourceList.some((resource: any) =>
          config.getNameFromResource(resource) === resourceName,
        );

        if (!stillThere || Date.now() - start > waitMs) {
          clearInterval(interval);
          const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
          const duration = isDetailsSync
            ? config.detailsConstants?.SYNC.MESSAGE_DURATIONS.SUCCESS ||
              config.cardConstants.MESSAGE_DURATIONS.SUCCESS
            : config.cardConstants.MESSAGE_DURATIONS.SUCCESS;
          message.open({
            type: 'success',
            content: friendly,
            key,
            duration,
          });
        }
      },
      isDetailsSync
        ? config.detailsConstants?.SYNC.POLLING.INTERVAL_MS || config.cardConstants.POLLING.INTERVAL_MS
        : config.cardConstants.POLLING.INTERVAL_MS,
    );
  } else {
    // Refresh data for Changed, NewlyCreated, and NoUpdate effects
    if (resourceName) {
      await (store.dispatch as AppDispatch)(config.fetchResourceDetailsThunk(resourceName));
    }

    const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
    const duration = isDetailsSync
      ? config.detailsConstants?.SYNC.MESSAGE_DURATIONS.SUCCESS ||
        config.cardConstants.MESSAGE_DURATIONS.SUCCESS
      : config.cardConstants.MESSAGE_DURATIONS.SUCCESS;
    message.open({
      type: 'success',
      content: friendly,
      key,
      duration,
    });
  }
};

export const handleSyncError = ({
  err,
  message,
  isDetailsSync,
  config,
}: HandleSyncErrorParams): void => {
  const meta = err?.normalized as { isTimeout?: boolean } | undefined;
  const phase = err?.response?.data?.data?.phase as string | undefined;
  const effect = err?.response?.data?.data?.syncEffect as string | undefined;
  const friendlyTimeout = isDetailsSync
    ? config.detailsConstants?.SYNC.TIMEOUT_MESSAGE || config.cardTimeoutMessage
    : config.cardTimeoutMessage;

  const friendly = meta?.isTimeout
    ? friendlyTimeout
    : (phase && SYNC_MESSAGES.byPhase[phase]) ||
      (effect && SYNC_MESSAGES.byEffect[effect!]) ||
      SYNC_MESSAGES.byPhase.Failed;

  const errorKey = isDetailsSync
    ? config.detailsConstants?.SYNC.ERROR_KEY || config.cardConstants.ERROR_KEY
    : config.cardConstants.ERROR_KEY;
  const duration = isDetailsSync
    ? config.detailsConstants?.SYNC.MESSAGE_DURATIONS.ERROR || config.cardConstants.MESSAGE_DURATIONS.ERROR
    : config.cardConstants.MESSAGE_DURATIONS.ERROR;

  message.open({
    type: 'error',
    content: friendly,
    key: errorKey,
    duration,
  });
};

