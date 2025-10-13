import React from 'react';
import {
  ClockCircleOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import TimeAgo from '../../../time/TimeAgo';
import { DEFAULT_COLORS } from '../../../../constants';
import { AppWorkload } from '../../../../interfaces/workload';

interface WorkloadGeneralInfoProps {
  workload: AppWorkload;
}

const Label: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ color: DEFAULT_COLORS.SUCCESS, fontSize: 16, display: 'inline-flex' }}>
      {icon}
    </span>
    <span
      style={{
        color: '#6b7280',
        fontWeight: 700,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}
    >
      {text}
    </span>
  </div>
);

const Row: React.FC<{ left: React.ReactNode; right: React.ReactNode; withDivider?: boolean }> = ({
  left,
  right,
  withDivider = true,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: withDivider ? '1px solid #eef2f6' : 'none',
      minHeight: 40,
    }}
  >
    <div>{left}</div>
    <div style={{ color: '#111827', fontWeight: 600 }}>{right}</div>
  </div>
);

const WorkloadGeneralInfo: React.FC<WorkloadGeneralInfoProps> = ({ workload }) => (
  <div style={{ padding: '6px 2px' }}>
    <Row
      left={<Label icon={<AppstoreOutlined />} text="Name" />}
      right={<span style={{ fontWeight: 700 }}>{workload.fasid?.sourceName || '—'}</span>}
    />

    <Row
      left={<Label icon={<DatabaseOutlined />} text="Grouper" />}
      right={<span style={{ fontWeight: 700 }}>{workload.fasid?.grouper || '—'}</span>}
    />

    <Row
      left={<Label icon={<DeploymentUnitOutlined />} text="Type" />}
      right={<span style={{ fontWeight: 700 }}>{workload.fasid?.sourceType || '—'}</span>}
    />

    <Row
      left={<Label icon={<ClockCircleOutlined />} text="Creation Date" />}
      right={<TimeAgo date={workload.fasid?.creationTime || new Date().toISOString()} />}
    />

    <Row
      left={<Label icon={<DatabaseOutlined />} text="Registry Type" />}
      right={<span style={{ fontWeight: 700 }}>{workload.cacid?.registry || '—'}</span>}
    />

    <Row
      left={<Label icon={<AppstoreOutlined />} text="Strategy" />}
      right={<span style={{ fontWeight: 700 }}>{workload.cacid?.strategy || '—'}</span>}
      withDivider={false}
    />
  </div>
);

export default WorkloadGeneralInfo;
