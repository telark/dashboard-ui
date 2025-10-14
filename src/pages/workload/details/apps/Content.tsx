import React, { Suspense, lazy } from 'react';
import { Card } from 'antd';
import WorkloadMetrics from '../../../../components/display/workloads/apps/Metrics';
import WorkloadBridges from '../../../../components/display/workloads/apps/Bridges';
import WorkloadGeneralInfo from '../../../../components/display/workloads/apps/GeneralInfo';
import SyncMode from '../../../../components/tabs/SyncMode';
import { FancySpinner } from '../../../../components/shared';
import { TAB_KEYS, type TabKey } from '../../../../components/display/workloads/apps/Tabs';
import type { AppWorkload } from '../../../../interfaces/workload';

// Lazy load heavy components
const WorkloadInstances = lazy(
  () => import('../../../../components/display/workloads/apps/Instances'),
);
const WorkloadHistory = lazy(() => import('../../../../components/display/workloads/apps/History'));

interface ContentProps {
  workload: AppWorkload;
  activeTab: TabKey;
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (isAutoSync: boolean) => void;
  handleWorkloadSyncSave: () => void;
}

const sectionCardStyle: React.CSSProperties = {
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  border: 'none',
  marginBottom: 16,
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
  }) => {
    return (
      <div>
        {/* Resource Summary */}
        <WorkloadMetrics workload={workload} />

        {/* Active section */}
        {activeTab === TAB_KEYS.GENERAL && (
          <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
            <WorkloadGeneralInfo workload={workload} />
          </Card>
        )}

        {activeTab === TAB_KEYS.INSTANCES && (
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
                <WorkloadInstances workload={workload} />
              </Suspense>
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
            />
          </Card>
        )}
      </div>
    );
  },
);

Content.displayName = 'Content';

export default Content;
