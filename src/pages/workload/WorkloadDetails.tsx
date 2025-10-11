import React, { useEffect, useState, Suspense, lazy } from 'react';
import { message, Card, Typography, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants';
import { WorkloadDetailsHook } from '../../hooks/WorkloadDetailsHook';
import WorkloadHeader from '../../components/display/workloads/WorkloadHeader';
import WorkloadMetrics from '../../components/display/workloads/WorkloadMetrics';
import WorkloadTabs, {
  TAB_KEYS,
  type TabKey,
} from '../../components/display/workloads/WorkloadTabs';
import WorkloadBridges from '../../components/display/workloads/WorkloadBridges';
import WorkloadGeneralInfo from '../../components/display/workloads/GeneralInfo';
import WorkloadHistory from '../../components/display/workloads/History';
import SyncMode from '../../components/tabs/SyncMode';
import FancySpinner from '../../components/common/FancySpinner';

// Lazy load heavy components
const WorkloadInstances = lazy(() => import('../../components/display/workloads/Instances'));

const { Title, Text } = Typography;

const sectionCardStyle: React.CSSProperties = {
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  border: 'none',
  marginBottom: 16,
};

const WorkloadDetails: React.FC = React.memo(() => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.GENERAL);

  const {
    workloadDetails: workload,
    loading,
    error,
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleWorkloadSyncSave,
  } = WorkloadDetailsHook();

  useEffect(() => {
    if (error) {
      message.error('Failed to load workload details');
      navigate('/workloads');
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <FancySpinner />
      </div>
    );
  }

  if (!workload) {
    return (
      <div style={{ padding: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/workloads')}>
          Back to Workloads
        </Button>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Title level={3}>Workload not found</Title>
          <Text type="secondary">The workload &quot;{name}&quot; could not be found.</Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: '100vh',
        marginTop: 60,
        paddingTop: 24,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 64,
      }}
    >
      {/* Header section */}
      <WorkloadHeader workload={workload} />

      {/* Resource Summary */}
      <WorkloadMetrics workload={workload} />

      {/* Tabs header */}
      <WorkloadTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
          <WorkloadHistory workload={workload} />
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
});

export default WorkloadDetails;
