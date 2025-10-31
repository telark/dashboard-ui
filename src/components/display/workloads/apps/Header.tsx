import React, { useState } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, AppstoreOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import StatusButton from '../../../buttons/StatusButton';
import TimeAgo from '../../../time/TimeAgo';
import { AppWorkload } from '../../../../interfaces/workload';
import { syncAppWorkloadDetails } from '../../../../utils/workload/sync';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

interface WorkloadHeaderProps {
  workload: AppWorkload;
}

const WorkloadHeader: React.FC<WorkloadHeaderProps> = ({ workload }) => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [syncing, setSyncing] = useState(false);
  const globalSyncing = useSelector((s: RootState) => (s.workload as any).syncing || {});
  const workloadName = workload?.fasid?.name;
  const isGloballySyncing = Boolean(workloadName && globalSyncing[workloadName]);

  const handleSync = async () => {
    await syncAppWorkloadDetails({
      workloadDetails: workload,
      setSyncing,
      message,
    });
  };

  return (
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
            Last update was{' '}
            <TimeAgo date={workload.config?.sync?.lastUpdateTime || new Date().toISOString()} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          size="middle"
          icon={<SyncOutlined />}
          loading={syncing || isGloballySyncing}
          onClick={handleSync}
        >
          Sync
        </Button>
        <Button size="middle" icon={<AppstoreOutlined />}>
          View Grouper
        </Button>
        <Button size="middle" onClick={() => navigate('/workloads')} icon={<ArrowLeftOutlined />}>
          Back to Workloads
        </Button>
      </div>
    </div>
  );
};

export default WorkloadHeader;
