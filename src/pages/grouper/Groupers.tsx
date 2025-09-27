import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message, Result, Button, Skeleton } from 'antd';
import { InboxOutlined, WarningTwoTone } from '@ant-design/icons';

import {
  fetchAllGroupersThunk,
  checkGrouperMaintenanceModeThunk,
  triggerGroupersSyncThunk,
  refreshAutoGroupersThunk,
} from '../../store/slices/grouperSlice';
import { GROUPERS_REFRESH_INTERVAL_MS, GROUPERS_SYNC_LS_KEY, GROUPERS_SYNC_THROTTLE_MS } from '../../constants/sync';
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
        } catch (_) {
          // Fallback without persistence
          dispatch(triggerGroupersSyncThunk());
        }
      }
    })();
  }, [loadGroupers]);
  // Poll only auto-sync groupers, aligned to exact interval boundaries
  useEffect(() => {
    let intervalId: number | undefined;
    const now = Date.now();
    const remainder = now % GROUPERS_REFRESH_INTERVAL_MS;
    const initialDelay = remainder === 0 ? GROUPERS_REFRESH_INTERVAL_MS : GROUPERS_REFRESH_INTERVAL_MS - remainder;

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
        <div style={gridStyle}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '100%',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                border: 'none',
                padding: '20px',
                background: '#fff',
              }}
            >
              <Skeleton active paragraph={{ rows: 3 }} title />
            </div>
          ))}
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
          icon={<InboxOutlined style={{ fontSize: '48px', color: '#1677ff' }} />}
          title="No groupers found"
          subTitle="Connect your first cluster or try again later."
          extra={
            <Button type="primary" onClick={loadGroupers}>
              Retry
            </Button>
          }
        />
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
