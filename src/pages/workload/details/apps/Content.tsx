import React, { Suspense, lazy, useMemo } from 'react';
import { Card } from 'antd';
import WorkloadBridges from '../../../../components/display/workloads/apps/Bridges';
import ViewDetails from '../../../../components/display/shared/views/ViewDetails';
import SyncMode from '../../../../components/tabs/SyncMode';
import { FancySpinner } from '../../../../components/shared';
import { TAB_KEYS, type TabKey } from '../../../../components/display/workloads/apps/Tabs';
import type { AppWorkload } from '../../../../interfaces/workload';
import { createWorkloadViewConfig } from '../../../../config/workloadViewConfig';
import InstancesTable from '../../../../components/display/workloads/apps/instances/Table';

const WorkloadHistory = lazy(() => import('../../../../components/display/workloads/apps/History'));

interface ContentProps {
  workload: AppWorkload;
  activeTab: TabKey;
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (isAutoSync: boolean) => void;
  handleWorkloadSyncSave: () => void;
  syncing?: boolean;
  isGloballySyncing?: boolean;
}

const sectionCardStyle: React.CSSProperties = {
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  border: 'none',
};

const Content: React.FC<ContentProps> = React.memo(
  ({
    workload,
    activeTab,
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleWorkloadSyncSave,
    syncing = false,
    isGloballySyncing = false,
  }) => {
    const workloadViewConfig = useMemo(() => {
      if (!workload) return null;
      return createWorkloadViewConfig(workload);
    }, [workload]);

    return (
      <>
        {/* Active section */}
        {activeTab === TAB_KEYS.GENERAL && workloadViewConfig && (
          <ViewDetails config={workloadViewConfig} />
        )}

        {activeTab === TAB_KEYS.INSTANCES && (
          <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
            <div style={{ padding: 4 }}>
              <InstancesTable workload={workload} />
            </div>
          </Card>
        )}

        {activeTab === TAB_KEYS.BRIDGES && (
          <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
            <div style={{ padding: 4 }}>
              <WorkloadBridges workload={workload} />
            </div>
          </Card>
        )}

        {activeTab === TAB_KEYS.HISTORY && (
          <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
            <div style={{ padding: 4 }}>
              <Suspense
                fallback={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '200px',
                    }}
                  >
                    <FancySpinner />
                  </div>
                }
              >
                <WorkloadHistory workload={workload} />
              </Suspense>
            </div>
          </Card>
        )}

        {activeTab === TAB_KEYS.SYNC && (
          <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
            <SyncMode
              isAutoSync={isAutoSync}
              loadingSave={loadingSave}
              hasChanges={hasChanges}
              handleAutoSyncChange={handleAutoSyncChange}
              handleSyncSave={handleWorkloadSyncSave}
              syncing={syncing}
              isGloballySyncing={isGloballySyncing}
            />
          </Card>
        )}
      </>
    );
  },
);

Content.displayName = 'Content';

export default Content;
