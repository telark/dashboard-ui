import React from 'react';
import { DEFAULT_COLORS, ICONS } from '../../../../constants';
import { AppWorkload } from '../../../../interfaces/workload';

interface WorkloadMetricsProps {
  workload: AppWorkload;
}

interface MetricItemProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  iconBackground: string;
  iconColor: string;
  value: string | number;
  label: string;
}

const MetricItem: React.FC<MetricItemProps> = ({
  icon: Icon,
  iconBackground,
  iconColor,
  value,
  label,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          background: iconBackground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
        }}
      >
        <Icon size={18} color={iconColor} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F33', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: '#5B6B7C', marginTop: 0, lineHeight: 1.1 }}>{label}</div>
      </div>
    </div>
  );
};

const WorkloadMetrics: React.FC<WorkloadMetricsProps> = ({ workload }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.06)',
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
        <MetricItem
          icon={ICONS.CPU}
          iconBackground="rgba(32,201,151,0.12)"
          iconColor={DEFAULT_COLORS.SUCCESS}
          value={workload.cacid?.usage?.resources?.totalCpu || 'N/A'}
          label="Total CPU"
        />
        <MetricItem
          icon={ICONS.MEMORY}
          iconBackground="rgba(59,130,246,0.12)"
          iconColor="#3B82F6"
          value={workload.cacid?.usage?.resources?.totalMemory || 'N/A'}
          label="Total Memory"
        />
        <MetricItem
          icon={ICONS.QOS}
          iconBackground="rgba(168,85,247,0.12)"
          iconColor="#A855F7"
          value={workload.cacid?.usage?.qos || 'N/A'}
          label="Quality of Service"
        />
        <MetricItem
          icon={ICONS.CONTAINER}
          iconBackground="rgba(245,158,11,0.12)"
          iconColor="#F59E0B"
          value={`${workload.cacid?.instances?.available || 0}/${workload.cacid?.instances?.total || 0}`}
          label="Available / Total"
        />
      </div>
    </div>
  );
};

export default WorkloadMetrics;
