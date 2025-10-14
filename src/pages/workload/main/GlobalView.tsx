import React, { useEffect, useCallback, useRef, memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { fetchAllAppsWorkloadsThunk, fetchAllBatchesWorkloadsThunk } from '../../../store/slices/workloadSlice';
import { createRetryHandler, cancelRetry, RetryCallbacks } from '../../../utils/retry';
import { WORKLOADS_PAGE_CONSTANTS } from '../../../constants/pages/workloads';
import { APP_ROUTES } from '../../../constants';
import type { AppWorkloadCardData, BatchWorkloadCardData } from '../../../interfaces/workload';
import {
  Loading,
  Error,
  Empty,
  Success,
} from '.';

const WorkloadsGlobalView: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { apps, batches, appLoading, batchLoading, appError, batchError } = useSelector((state: RootState) => state.workload);
  
  // Retry state
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const timeoutRefs = useRef<{ current: NodeJS.Timeout | null }[]>([]);

  const handleLoadWorkloads = useCallback(async () => {
    await Promise.all([
      dispatch(fetchAllAppsWorkloadsThunk()),
      dispatch(fetchAllBatchesWorkloadsThunk())
    ]);
    return true;
  }, [dispatch]);

  useEffect(() => {
    handleLoadWorkloads();
  }, [handleLoadWorkloads]);

  useEffect(() => {
    if (appError || batchError) {
      message.error('Failed to load workloads');
      // Auto-start retry when error occurs
      if (!isRetrying) {
        handleRetry();
      }
    }
  }, [appError, batchError, isRetrying]);

  // Retry callbacks
  const retryCallbacks: RetryCallbacks = {
    setRetrying: setIsRetrying,
    setRetryCount: setRetryCount,
    setNextRetryIn: setNextRetryIn,
    setInCooldown: setIsInCooldown,
    setCooldownTime: setCooldownTime,
    onSuccess: () => message.success(WORKLOADS_PAGE_CONSTANTS.MESSAGES.SUCCESS),
    onError: () => message.error(WORKLOADS_PAGE_CONSTANTS.MESSAGES.ERROR_RETRYING_COOLDOWN),
  };

  // Create retry handler
  const handleRetry = useCallback(async () => {
    if (isRetrying || isInCooldown) return;
    
    const retryHandler = createRetryHandler(
      () => handleLoadWorkloads(),
      retryCallbacks
    );
    
    await retryHandler();
  }, [handleLoadWorkloads, isRetrying, isInCooldown, retryCallbacks]);
  
  const handleCancelRetry = useCallback(() => {
    cancelRetry(timeoutRefs.current, retryCallbacks);
  }, [retryCallbacks]);

  const handleAppClick = (app: AppWorkloadCardData) => {
    navigate(APP_ROUTES.APP_WORKLOAD_DETAILS.replace(':name', app.name));
  };

  const handleBatchClick = (batch: BatchWorkloadCardData) => {
    // TODO: Implement batch details navigation when ready
    console.log('Batch clicked:', batch);
  };

  const loading = appLoading || batchLoading;
  const error = appError || batchError;
  const hasWorkloads = apps.length > 0 || batches.length > 0;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        isInCooldown={isInCooldown}
        cooldownTime={cooldownTime}
        isRetrying={isRetrying}
        retryCount={retryCount}
        nextRetryIn={nextRetryIn}
        onCancel={handleCancelRetry}
        onRetry={handleRetry}
      />
    );
  }

  if (!loading && !hasWorkloads) {
    return <Empty onRefresh={handleLoadWorkloads} />;
  }

  return (
    <Success
      apps={apps}
      batches={batches}
      appLoading={appLoading}
      batchLoading={batchLoading}
      onAppClick={handleAppClick}
      onBatchClick={handleBatchClick}
    />
  );
});

WorkloadsGlobalView.displayName = 'WorkloadsGlobalView';

export default WorkloadsGlobalView;
