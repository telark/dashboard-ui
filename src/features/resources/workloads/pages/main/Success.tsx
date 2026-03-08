import React, { useState, useMemo } from 'react';
import AppsList from '../../components/display/apps/list/AppsList';
import BatchesList from '../../components/display/batches/List';
import { TabButton } from '../../../../../components/display/buttons';
import type { AppWorkloadCardData, BatchWorkloadCardData } from '../../models';

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
  onRefresh?: () => void;
}

const Success: React.FC<SuccessProps> = React.memo(
  ({ apps, batches, appLoading, batchLoading, onAppClick, onRefresh }) => {
    const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.APPS);

    const headingStyle = useMemo(
      () => ({
        margin: 0,
        marginBottom: 0,
        fontWeight: 600,
        fontSize: '24px',
        lineHeight: 1.35,
        color: 'rgba(0, 0, 0, 0.88)',
      }),
      [],
    );

    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={headingStyle}>Workloads</h2>
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

        {activeTab === TAB_KEYS.BATCHES && <BatchesList batches={batches} loading={batchLoading} />}
      </div>
    );
  },
);

Success.displayName = 'Success';

export default Success;
