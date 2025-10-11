import React, { useEffect, useCallback, useRef, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message, Button } from 'antd';
import { AppstoreOutlined, ReloadOutlined } from '@ant-design/icons';
import FancySpinner from '../../components/common/FancySpinner';
// Remove the useRetryWithBackoff import for now

import {
  fetchAllGroupersThunk,
  fetchAllGroupersSilentThunk,
  checkGrouperMaintenanceModeThunk,
  triggerGroupersSyncThunk,
  refreshAutoGroupersThunk,
} from '../../store/slices/grouperSlice';
import {
  GROUPERS_REFRESH_INTERVAL_MS,
  GROUPERS_SYNC_LS_KEY,
  GROUPERS_SYNC_THROTTLE_MS,
} from '../../constants/sync';
import GrouperCard from '../../components/cards/GrouperCard';
import { RootState, AppDispatch } from '../../store';
import { DEFAULT_COLORS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/ui';

const Groupers: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const { groupers, loading, error } = useSelector((state: RootState) => state.grouper);
  const hasTriggeredInitialSync = useRef(false);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [nextRetryIn, setNextRetryIn] = React.useState(0);
  const [isInCooldown, setIsInCooldown] = React.useState(false);
  const [cooldownTime, setCooldownTime] = React.useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadGroupers = useCallback(async () => {
    const result = await dispatch(fetchAllGroupersThunk());
    if (fetchAllGroupersThunk.fulfilled.match(result)) {
      result.payload.forEach((grouper: any) => {
        if (grouper?.hasMaintenance) {
          dispatch(checkGrouperMaintenanceModeThunk(grouper.name));
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      await loadGroupers();
      if (!hasTriggeredInitialSync.current) {
        hasTriggeredInitialSync.current = true;
        // Throttle sync trigger to once every GROUPERS_SYNC_THROTTLE_MS using localStorage
        try {
          const now = Date.now();
          const lastStr = localStorage.getItem(GROUPERS_SYNC_LS_KEY);
          const last = lastStr ? parseInt(lastStr, 10) : 0;
          if (!last || now - last >= GROUPERS_SYNC_THROTTLE_MS) {
            dispatch(triggerGroupersSyncThunk());
            localStorage.setItem(GROUPERS_SYNC_LS_KEY, String(now));
          }
        } catch {
          // Fallback without persistence
          dispatch(triggerGroupersSyncThunk());
        }
      }
    })();
  }, [loadGroupers, dispatch]);
  // Poll only auto-sync groupers, aligned to exact interval boundaries
  useEffect(() => {
    let intervalId: number | undefined;
    const now = Date.now();
    const remainder = now % GROUPERS_REFRESH_INTERVAL_MS;
    const initialDelay =
      remainder === 0 ? GROUPERS_REFRESH_INTERVAL_MS : GROUPERS_REFRESH_INTERVAL_MS - remainder;

    const timeoutId = window.setTimeout(() => {
      dispatch(refreshAutoGroupersThunk());
      intervalId = window.setInterval(() => {
        dispatch(refreshAutoGroupersThunk());
      }, GROUPERS_REFRESH_INTERVAL_MS);
    }, initialDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [dispatch]);

  // Manual retry function with progressive backoff and cooldown
  const handleRetry = useCallback(async () => {
    if (isRetrying || isInCooldown) return;
    
    setIsRetrying(true);
    setRetryCount(0);
    
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second
    const cooldownDuration = 60000; // 1 minute cooldown
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      setRetryCount(attempt + 1);
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), 30000);
      setNextRetryIn(delay);
      
      // Countdown timer
      let remainingTime = delay;
      const countdownInterval = setInterval(() => {
        remainingTime -= 1000;
        setNextRetryIn(Math.max(0, remainingTime));
        
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      // Wait for delay
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, delay);
      });
      
      clearInterval(countdownInterval);
      
      try {
        const result = await dispatch(fetchAllGroupersSilentThunk());
        if (fetchAllGroupersSilentThunk.fulfilled.match(result)) {
          setIsRetrying(false);
          setRetryCount(0);
          setNextRetryIn(0);
          message.success('Groupers loaded successfully!');
          return;
        }
      } catch (error) {
        // Continue to next attempt
      }
    }
    
    // All retries failed - start cooldown
    setIsRetrying(false);
    setRetryCount(0);
    setNextRetryIn(0);
    setIsInCooldown(true);
    setCooldownTime(cooldownDuration);
    
    // Start cooldown countdown
    let remainingCooldown = cooldownDuration;
    const cooldownInterval = setInterval(() => {
      remainingCooldown -= 1000;
      setCooldownTime(Math.max(0, remainingCooldown));
      
      if (remainingCooldown <= 0) {
        clearInterval(cooldownInterval);
        setIsInCooldown(false);
        setCooldownTime(0);
        // Auto-retry after cooldown
        setTimeout(() => handleRetry(), 1000);
      }
    }, 1000);
    
    // Store interval reference for cleanup
    cooldownTimeoutRef.current = setTimeout(() => {
      clearInterval(cooldownInterval);
    }, cooldownDuration);
    
    message.error('Unable to connect after multiple attempts. Starting cooldown period...');
  }, [dispatch, isRetrying, isInCooldown]);
  
  const cancelRetry = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
    setIsRetrying(false);
    setRetryCount(0);
    setNextRetryIn(0);
    setIsInCooldown(false);
    setCooldownTime(0);
  }, []);

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
          }}
        >
          <FancySpinner label="Loading groupers…" showLabel={true} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 60px)',
          marginTop: '60px',
          width: '100%',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#0B1F33', marginBottom: 16 }}>
            Connection Problem
          </div>
          <div style={{ fontSize: 16, color: '#5B6B7C', marginBottom: 32, lineHeight: 1.6 }}>
            {isInCooldown 
              ? 'Connection failed after multiple attempts. Cooling down before retry...'
              : 'Unable to connect to the server. Retrying automatically...'
            }
          </div>
          
          <div style={{ textAlign: 'center' }}>
            {isInCooldown ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#F59E0B', marginBottom: 12 }}>
                  Cooldown Period
                </div>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
                  Retrying in {Math.ceil(cooldownTime / 1000)} seconds...
                </div>
                <div style={{ 
                  width: '100%', 
                  height: 8, 
                  backgroundColor: '#E5E7EB', 
                  borderRadius: 4,
                  overflow: 'hidden',
                  marginBottom: 16
                }}>
                  <div style={{
                    width: `${((60000 - cooldownTime) / 60000) * 100}%`,
                    height: '100%',
                    backgroundColor: '#F59E0B',
                    transition: 'width 1s linear'
                  }} />
                </div>
              </>
            ) : (
              <>
                <FancySpinner label="Retrying connection..." showLabel={true} />
                <div style={{ marginTop: 12, color: '#666', fontSize: 14 }}>
                  Attempt {retryCount} of 5
                  {nextRetryIn > 0 && (
                    <div>Next retry in {Math.ceil(nextRetryIn / 1000)} seconds...</div>
                  )}
                </div>
              </>
            )}
            <Button 
              type="text" 
              onClick={cancelRetry}
              style={{ marginTop: 8 }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && groupers.length === 0) {
    const handleRefresh = async () => {
      await loadGroupers();
    };

    return (
      <div style={pageStyle}>
        <div
          style={{
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(32,201,151,0.12)',
              boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              color: DEFAULT_COLORS.SUCCESS,
              fontSize: 24,
            }}
          >
            <AppstoreOutlined />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0B1F33', marginBottom: 8 }}>
            No groupers yet
          </div>
          <div style={{ color: '#5B6B7C', marginBottom: 20, maxWidth: 560, lineHeight: 1.6 }}>
            When your cluster is connected, groupers represent your namespaces. Make sure you have
            at least one namespace (excluding any you’ve set to be ignored in Settings). Try syncing
            to pull the latest.
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Button type="primary" icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={gridStyle}>
        {groupers.map((grouper, index) => (
          <GrouperCard key={grouper?.name ?? index} {...grouper} />
        ))}
      </div>
    </div>
  );
});

export default Groupers;
