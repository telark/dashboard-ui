import React, { useEffect, useCallback, useRef, memo, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { RootState, AppDispatch } from '../../../store';
import { COMPONENT_STYLES } from '../../../constants/ui';
import {
  loadBridges,
  loadBridgesSilent,
  handleInitialSync,
  setupAutoRefresh,
} from '../../../utils/bridge/state';
import { createRetryHandler, cancelRetry, RetryCallbacks } from '../../../utils/shared/retry';
import { BRIDGES_PAGE_CONSTANTS } from '../../../constants/pages/bridges';
import { Loading, Error, Empty, Success } from '.';

const BridgesGlobalView: React.FC = memo(function BridgesGlobalView() {
  const dispatch: AppDispatch = useDispatch();
  const { bridges, loading, error } = useSelector((state: RootState) => state.bridge);
  const hasTriggeredInitialSync = useRef(false);

  // Retry state
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const timeoutRefs = useRef<{ current: ReturnType<typeof setTimeout> | null }[]>([]);

  const handleLoadBridges = useCallback(async () => {
    await loadBridges(dispatch);
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      await handleLoadBridges();
      if (!hasTriggeredInitialSync.current) {
        hasTriggeredInitialSync.current = true;
        await handleInitialSync(dispatch);
      }
    })();
  }, [handleLoadBridges, dispatch]);

  // Poll only auto-sync bridges, aligned to exact interval boundaries
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
      onSuccess: () => message.success(BRIDGES_PAGE_CONSTANTS.MESSAGES.SUCCESS),
      onError: () => message.error(BRIDGES_PAGE_CONSTANTS.MESSAGES.ERROR_RETRYING_COOLDOWN),
    }),
    [],
  );

  // Create retry handler
  const handleRetry = useCallback(async () => {
    if (isRetrying || isInCooldown) return;

    const retryHandler = createRetryHandler(() => loadBridgesSilent(dispatch), retryCallbacks);

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

  const pageStyle = COMPONENT_STYLES.PAGES.BRIDGES.pageStyle;
  const gridStyle = COMPONENT_STYLES.PAGES.BRIDGES.gridStyle;

  if (loading) {
    return (
      <div style={pageStyle}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <Error
        isInCooldown={isInCooldown}
        cooldownTime={cooldownTime}
        retryCount={retryCount}
        nextRetryIn={nextRetryIn}
        onCancel={handleCancelRetry}
      />
    );
  }

  if (!loading && bridges.length === 0) {
    return (
      <div style={pageStyle}>
        <Empty onRefresh={handleLoadBridges} />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={gridStyle}>
        <Success bridges={bridges} />
      </div>
    </div>
  );
});

export default BridgesGlobalView;
