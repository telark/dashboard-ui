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
import { GROUPERS_REFRESH_INTERVAL_MS } from '../../constants/sync';
import GrouperCard from '../../components/cards/GrouperCard';
import { RootState, AppDispatch } from '../../store';

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
        // After the first fetch, trigger sync-manager to refresh server-side state
        dispatch(triggerGroupersSyncThunk());
      }
    })();
  }, [loadGroupers]);
  // Poll only auto-sync groupers, aligned with sync-manager fetch interval
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshAutoGroupersThunk());
    }, GROUPERS_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 0fr))',
          gap: '16px',
          padding: '20px',
          marginTop: '60px',
        }}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '100%',
              maxWidth: '600px',
              borderRadius: '15px',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)',
              border: 'none',
              padding: '28px',
              background: '#fff',
            }}
          >
            <Skeleton active paragraph={{ rows: 3 }} title />
          </div>
        ))}
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 0fr))',
        gap: '16px',
        padding: '20px',
        marginTop: '60px',
      }}
    >
      {groupers.map((grouper, index) => (
        <GrouperCard key={grouper?.name ?? index} {...grouper} />
      ))}
    </div>
  );
};

export default Groupers;
