import React, { useState } from 'react';
import { Typography } from 'antd';
import AppsList from '../../../components/display/workloads/apps/AppsList';
import BatchesList from '../../../components/display/workloads/batches/List';
import { TabButton } from '../../../components/shared';
import type { AppWorkloadCardData, BatchWorkloadCardData } from '../../../interfaces/workload';

const { Title } = Typography;

const TAB_KEYS = {
  APPS: 'apps',
  BATCHES: 'batches',
} as const;

type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

interface SuccessProps {
  apps: AppWorkloadCardData[];
  batches: BatchWorkloadCardData[];
  appLoading: boolean;
  batchLoading: boolean;
  onAppClick: (app: AppWorkloadCardData) => void;
  onBatchClick: (batch: BatchWorkloadCardData) => void;
  onRefresh?: () => void;
}

const Success: React.FC<SuccessProps> = React.memo(
  ({ apps, batches, appLoading, batchLoading, onAppClick, onBatchClick, onRefresh }) => {
    const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.APPS);

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
            onAppClick={onAppClick}
            onRefresh={onRefresh}
            showFullEmptyMessage={apps.length === 0 && batches.length === 0}
          />
        )}

        {activeTab === TAB_KEYS.BATCHES && (
          <BatchesList batches={batches} loading={batchLoading} onBatchClick={onBatchClick} />
        )}
      </div>
    );
  },
);

Success.displayName = 'Success';

export default Success;
