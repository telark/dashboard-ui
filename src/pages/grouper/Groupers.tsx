import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message, Result, Button } from 'antd';
import { WarningTwoTone, AppstoreOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';

import {
  fetchAllGroupersThunk,
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

const Groupers: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { groupers, loading, error } = useSelector((state: RootState) => state.grouper);
  const hasTriggeredInitialSync = useRef(false);

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

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const pageStyle: React.CSSProperties = {
    background: DEFAULT_COLORS.PAGE_BG,
    minHeight: 'calc(100vh - 60px)',
    padding: '48px 24px 24px',
    marginTop: '60px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(260px, 1fr))',
    gap: '16px',
  };

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
          <Button type="text" icon={<SyncOutlined spin />} disabled>
            Loading groupers…
          </Button>
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
        <Result
          status="error"
          icon={<WarningTwoTone twoToneColor="#faad14" style={{ fontSize: '48px' }} />}
          title="Unable to load Groupers"
          subTitle={String(error)}
          extra={
            <Button type="primary" onClick={loadGroupers}>
              Retry
            </Button>
          }
        />
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
};

export default Groupers;
