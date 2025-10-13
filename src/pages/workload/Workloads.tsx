import React, { useEffect, useState } from 'react';
import { Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppsWorkloadsThunk, fetchAllBatchesWorkloadsThunk } from '../../store/slices/workloadSlice';
import AppsList from '../../components/display/workloads/apps/AppsList';
import BatchesList from '../../components/display/workloads/batches/List';
import type { AppWorkloadCardData, BatchWorkloadCardData } from '../../interfaces/workload';
import { APP_ROUTES, DEFAULT_COLORS } from '../../constants';
import type { RootState, AppDispatch } from '../../store';

const { Title } = Typography;

const TAB_KEYS = {
  APPS: 'apps',
  BATCHES: 'batches',
} as const;

type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ 
  label, 
  active, 
  onClick 
}) => {
  const [hovered, setHovered] = useState(false);
  const background = active ? '#fff' : hovered ? 'rgba(32,201,151,0.08)' : 'transparent';
  const color = active ? '#0B1F33' : hovered ? DEFAULT_COLORS.SUCCESS : '#6b7280';
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        padding: '10px 18px',
        borderRadius: 22,
        background,
        color,
        fontWeight: active ? 700 : 600,
        boxShadow: active ? '0 6px 18px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
};

const Workloads: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { apps, batches, appLoading, batchLoading, appError, batchError } = useSelector((state: RootState) => state.workload);
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.APPS);

  useEffect(() => {
    dispatch(fetchAllAppsWorkloadsThunk());
    dispatch(fetchAllBatchesWorkloadsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (appError || batchError) {
      message.error('Failed to load workloads');
    }
  }, [appError, batchError]);

  const handleAppClick = (app: AppWorkloadCardData) => {
    navigate(APP_ROUTES.APP_WORKLOAD_DETAILS.replace(':name', app.name));
  };

  const handleBatchClick = (batch: BatchWorkloadCardData) => {
    // TODO: Implement batch details navigation when ready
    console.log('Batch clicked:', batch);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Workloads</Title>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: 'linear-gradient(180deg, rgba(239,244,250,0.6), rgba(239,244,250,0))',
          padding: '8px 0',
          borderRadius: 24,
          marginBottom: 24,
        }}
      >
        <TabButton
          label="Apps"
          active={activeTab === TAB_KEYS.APPS}
          onClick={() => setActiveTab(TAB_KEYS.APPS)}
        />
        <TabButton
          label="Batches"
          active={activeTab === TAB_KEYS.BATCHES}
          onClick={() => setActiveTab(TAB_KEYS.BATCHES)}
        />
      </div>

      {/* Content */}
      {activeTab === TAB_KEYS.APPS && (
        <AppsList 
          apps={apps} 
          loading={appLoading} 
          onAppClick={handleAppClick} 
        />
      )}

      {activeTab === TAB_KEYS.BATCHES && (
        <BatchesList 
          batches={batches} 
          loading={batchLoading} 
          onBatchClick={handleBatchClick} 
        />
      )}
    </div>
  );
};

export default Workloads;
