import React, { useEffect, useState } from 'react';
import {
  message,
  Spin,
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Descriptions,
  Table,
  Space,
  Button,
  Divider,
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftOutlined, AppstoreOutlined, SyncOutlined } from '@ant-design/icons';
import { fetchWorkloadDetailsThunk } from '../../store/slices/workloadSlice';
import { formatDistanceToNow } from 'date-fns';
import type { RootState, AppDispatch } from '../../store';
import { DEFAULT_COLORS } from '../../constants';
import StatusButton from '../../components/buttons/StatusButton';
import TimeAgo from '../../components/time/TimeAgo';
import FancySpinner from '../../components/common/FancySpinner';
import WorkloadGeneralInfo from '../../components/display/WorkloadGeneralInfo';
import WorkloadInstances from '../../components/display/WorkloadInstances';
import WorkloadHistory from '../../components/display/WorkloadHistory';
import WorkloadSyncMode from '../../components/display/WorkloadSyncMode';

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

const WorkloadDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { details: workload, loading, error } = useSelector((state: RootState) => state.workload);
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.GENERAL);

  useEffect(() => {
    if (name) {
      dispatch(fetchWorkloadDetailsThunk(name));
    }
  }, [dispatch, name]);

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
        padding: '24px',
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
                status={(workload.cacid.status as 'Active' | 'Inactive') || 'Inactive'}
                icon={<AppstoreOutlined />}
              />
            </div>
            <div style={{ color: '#5B6B7C', fontSize: 12, marginTop: 4 }}>
              Last updated <TimeAgo date={workload.fasid.creationTime} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            size="middle"
            onClick={() => navigate('/workloads')}
            icon={<ArrowLeftOutlined />}
          >
            Back to Workloads
          </Button>
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

      {activeTab === TAB_KEYS.HISTORY && (
        <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
          <WorkloadHistory workload={workload} />
        </Card>
      )}

      {activeTab === TAB_KEYS.SYNC && (
        <Card style={sectionCardStyle} styles={{ body: { padding: 16 } }}>
          <WorkloadSyncMode workload={workload} />
        </Card>
      )}
    </div>
  );
};

export default WorkloadDetails;
