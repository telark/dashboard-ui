import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import { Workload } from '../../../interfaces/workload';

interface WorkloadMetricsProps {
  workload: Workload;
}

const WorkloadMetrics: React.FC<WorkloadMetricsProps> = ({ workload }) => {
  return (
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
        {/* CPU Metric */}
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

        {/* Memory Metric */}
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

        {/* QoS Metric */}
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

        {/* Pods Metric */}
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
  );
};

export default WorkloadMetrics;
