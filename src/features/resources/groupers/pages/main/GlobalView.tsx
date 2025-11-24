import React, { useEffect, useCallback, useRef, memo, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { RootState, AppDispatch } from '../../../../../store';
import { COMPONENT_STYLES } from '../../../../../constants/layout/ui';
import {
  loadGroupers,
  loadGroupersSilent,
  handleInitialSync,
  setupAutoRefresh,
} from '../../utils/management/state';
import { createRetryHandler, cancelRetry, RetryCallbacks } from '../../../../../utils/shared/retry';
import { GROUPERS_CONSTANTS } from '../../constants';
import LoadingView from '../../../../../components/display/shared/views/LoadingView';
import { GrouperMainError, GrouperMainEmpty, Success } from '..';

const GroupersGlobalView: React.FC = memo(function GroupersGlobalView() {
  const dispatch: AppDispatch = useDispatch();
  const { groupers, loading, error } = useSelector((state: RootState) => state.grouper);
  const hasTriggeredInitialSync = useRef(false);

  // Retry state
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const timeoutRefs = useRef<{ current: ReturnType<typeof setTimeout> | null }[]>([]);

  const handleLoadGroupers = useCallback(async () => {
    await loadGroupers(dispatch);
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      await handleLoadGroupers();
      if (!hasTriggeredInitialSync.current) {
        hasTriggeredInitialSync.current = true;
        await handleInitialSync(dispatch);
      }
    })();
  }, [handleLoadGroupers, dispatch]);
  // Poll only auto-sync groupers, aligned to exact interval boundaries
  useEffect(() => {
    let cleanupFn: (() => void) | undefined;

    setupAutoRefresh(dispatch, (cleanup) => {
      cleanupFn = cleanup;
    });

    return () => {
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [dispatch]);

  // Retry callbacks
  const retryCallbacks: RetryCallbacks = useMemo(
    () => ({
      setRetrying: setIsRetrying,
      setRetryCount: setRetryCount,
      setNextRetryIn: setNextRetryIn,
      setInCooldown: setIsInCooldown,
      setCooldownTime: setCooldownTime,
      onSuccess: () => message.success(GROUPERS_CONSTANTS.MESSAGES.SUCCESS),
      onError: () => message.error(GROUPERS_CONSTANTS.MESSAGES.ERROR_RETRYING_COOLDOWN),
    }),
    [],
  );

  // Create retry handler
  const handleRetry = useCallback(async () => {
    if (isRetrying || isInCooldown) return;

    const retryHandler = createRetryHandler(() => loadGroupersSilent(dispatch), retryCallbacks);

    await retryHandler();
  }, [dispatch, isRetrying, isInCooldown, retryCallbacks]);

  const handleCancelRetry = useCallback(() => {
    cancelRetry(timeoutRefs.current, retryCallbacks);
  }, [retryCallbacks]);

  useEffect(() => {
    if (error) {
      message.error(error);
      // Auto-start retry when error occurs
      if (!isRetrying) {
        handleRetry();
      }
    }
  }, [error, isRetrying, handleRetry]);

  const pageStyle = COMPONENT_STYLES.PAGES.GROUPERS.pageStyle;
  const gridStyle = COMPONENT_STYLES.PAGES.GROUPERS.gridStyle;

  if (loading) {
    return (
      <div style={pageStyle}>
        <LoadingView label={GROUPERS_CONSTANTS.MESSAGES.LOADING} />
      </div>
    );
  }

  if (error) {
    return (
      <GrouperMainError
        isInCooldown={isInCooldown}
        cooldownTime={cooldownTime}
        retryCount={retryCount}
        nextRetryIn={nextRetryIn}
        onCancel={handleCancelRetry}
      />
    );
  }

  if (!loading && groupers.length === 0) {
    return (
      <div style={pageStyle}>
        <GrouperMainEmpty onRefresh={handleLoadGroupers} />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={gridStyle}>
        <Success groupers={groupers} />
      </div>
    </div>
  );
});

export default GroupersGlobalView;
