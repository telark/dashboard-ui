import React, { useEffect, useState, memo } from 'react';
import {
  message,
  Spin,
  Card,
  Typography,
  Button,
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeftOutlined, AppstoreOutlined, SyncOutlined, LinkOutlined } from '@ant-design/icons';
import type { AppDispatch } from '../../store';
import { DEFAULT_COLORS } from '../../constants';
import StatusButton from '../../components/buttons/StatusButton';
import TimeAgo from '../../components/time/TimeAgo';
import WorkloadGeneralInfo from '../../components/display/workloads/GeneralInfo';
import WorkloadInstances from '../../components/display/workloads/Instances';
import WorkloadHistory from '../../components/display/workloads/History';
import SyncMode from '../../components/tabs/SyncMode';
import { WorkloadDetailsHook } from '../../hooks/WorkloadDetailsHook';

const { Title, Text } = Typography;

const sectionCardStyle: React.CSSProperties = {
  borderRadius: 16,
  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  border: 'none',
  marginBottom: 16,
};

const TAB_KEYS = {
  GENERAL: 'general',
  INSTANCES: 'instances',
  BRIDGES: 'bridges',
  HISTORY: 'history',
  SYNC: 'sync',
} as const;

type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({
  label,
  active,
  onClick,
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

const WorkloadDetails: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.GENERAL);

  // Use hook for all data management (like grouper does)
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

  // Data fetching is handled by the hook (like grouper does)

  useEffect(() => {
    if (error) {
      message.error('Failed to load workload details');
      navigate('/workloads');
    }
  }, [error, navigate]);


  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
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
          <Text type="secondary">The workload "{name}" could not be found.</Text>
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
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
          padding: 16,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(32,201,151,0.12)',
              boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: DEFAULT_COLORS.SUCCESS,
              fontSize: 20,
            }}
          >
            <AppstoreOutlined />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0B1F33' }}>
                {workload.fasid.sourceName}
              </div>
              <StatusButton
                status={workload.cacid.status === 'Available' ? 'Active' : 'Inactive'}
                icon={<SyncOutlined />}
              />
            </div>
            <div style={{ color: '#5B6B7C', fontSize: 12, marginTop: 4 }}>
              Last update was <TimeAgo date={workload.config?.sync?.lastUpdateTime || new Date().toISOString()} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            size="middle"
            icon={<SyncOutlined />}
          >
            Sync
          </Button>
          <Button
            size="middle"
            icon={<AppstoreOutlined />}
          >
            View Grouper
          </Button>
          <Button
            size="middle"
            onClick={() => navigate('/workloads')}
            icon={<ArrowLeftOutlined />}
          >
            Back to Workloads
          </Button>
        </div>
      </div>

      {/* Resource Summary */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.06)',
          padding: 8,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(32,201,151,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: DEFAULT_COLORS.SUCCESS,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              CPU
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F33' }}>
                {workload.cacid?.usage?.resources?.totalCpu || 'N/A'}
              </div>
              <div style={{ fontSize: 12, color: '#5B6B7C' }}>Total CPU</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(59,130,246,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3B82F6',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Mem
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F33' }}>
                {workload.cacid?.usage?.resources?.totalMemory || 'N/A'}
              </div>
              <div style={{ fontSize: 12, color: '#5B6B7C' }}>Total Memory</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(168,85,247,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A855F7',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              QoS
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F33' }}>
                {workload.cacid?.usage?.qos || 'N/A'}
              </div>
              <div style={{ fontSize: 12, color: '#5B6B7C' }}>Quality of Service</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(245,158,11,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F59E0B',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Pods
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F33' }}>
                {workload.cacid?.instances?.available || 0}/{workload.cacid?.instances?.total || 0}
              </div>
              <div style={{ fontSize: 12, color: '#5B6B7C' }}>Available / Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: 'linear-gradient(180deg, rgba(239,244,250,0.6), rgba(239,244,250,0))',
          padding: '8px 0',
          borderRadius: 24,
          marginBottom: 16,
        }}
      >
        <TabButton
          label="General"
          active={activeTab === TAB_KEYS.GENERAL}
          onClick={() => setActiveTab(TAB_KEYS.GENERAL)}
        />
        <TabButton
          label="Instances"
          active={activeTab === TAB_KEYS.INSTANCES}
          onClick={() => setActiveTab(TAB_KEYS.INSTANCES)}
        />
        <TabButton
          label="Bridges"
          active={activeTab === TAB_KEYS.BRIDGES}
          onClick={() => setActiveTab(TAB_KEYS.BRIDGES)}
        />
        <TabButton
          label="History"
          active={activeTab === TAB_KEYS.HISTORY}
          onClick={() => setActiveTab(TAB_KEYS.HISTORY)}
        />
        <TabButton
          label="Sync Mode"
          active={activeTab === TAB_KEYS.SYNC}
          onClick={() => setActiveTab(TAB_KEYS.SYNC)}
        />
      </div>

      {/* Active section */}
      {activeTab === TAB_KEYS.GENERAL && (
        <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
          <WorkloadGeneralInfo workload={workload} />
        </Card>
      )}

      {activeTab === TAB_KEYS.INSTANCES && (
        <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
          <div style={{ padding: 4 }}>
            <WorkloadInstances workload={workload} />
          </div>
        </Card>
      )}

      {activeTab === TAB_KEYS.BRIDGES && (
        <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
          <div style={{ padding: 4 }}>
            {workload.cacid?.bridges && workload.cacid.bridges.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {workload.cacid.bridges.map((bridge, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 12,
                      padding: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          background: bridge.isSameGrouper 
                            ? 'rgba(32,201,151,0.12)' 
                            : 'rgba(59,130,246,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: bridge.isSameGrouper 
                            ? DEFAULT_COLORS.SUCCESS 
                            : '#3B82F6',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <LinkOutlined />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F33' }}>
                          {bridge.name}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: bridge.isSameGrouper 
                            ? 'rgba(32,201,151,0.12)' 
                            : 'rgba(59,130,246,0.12)',
                          color: bridge.isSameGrouper 
                            ? DEFAULT_COLORS.SUCCESS 
                            : '#3B82F6',
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {bridge.isSameGrouper ? 'Same Grouper' : 'External'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(32,201,151,0.12)',
                    boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    color: DEFAULT_COLORS.SUCCESS,
                    fontSize: 18,
                  }}
                >
                  <LinkOutlined />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0B1F33', marginBottom: 8 }}>
                  No Bridges Attached
                </div>
                <div style={{ color: '#5B6B7C', marginBottom: 20, maxWidth: 480, lineHeight: 1.6 }}>
                  This workload doesn't have any services connected yet. Services allow communication 
                  between different workloads and components in your cluster.
                </div>
              </div>
            )}
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
