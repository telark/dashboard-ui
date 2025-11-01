import React from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { AppWorkload } from '../../../../interfaces/workload';
import { AiOutlineApi } from 'react-icons/ai';

interface WorkloadBridgesProps {
  workload: AppWorkload;
}

const WorkloadBridges: React.FC<WorkloadBridgesProps> = ({ workload }) => {
  const bridges = workload.cacid?.bridges || [];

  if (bridges.length === 0) {
    return (
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
          <AiOutlineApi />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0B1F33', marginBottom: 8 }}>
          No Bridges Attached
        </div>
        <div style={{ color: '#5B6B7C', marginBottom: 20, maxWidth: 480, lineHeight: 1.6 }}>
          This workload doesn&apos;t have any services connected yet. Services allow communication
          between different workloads and components in your cluster.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {bridges.map((bridge, index) => (
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
                color: bridge.isSameGrouper ? DEFAULT_COLORS.SUCCESS : '#3B82F6',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <AiOutlineApi />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1F33' }}>{bridge.name}</div>
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
                color: bridge.isSameGrouper ? DEFAULT_COLORS.SUCCESS : '#3B82F6',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {bridge.isSameGrouper ? 'Same Grouper' : 'External Grouper'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkloadBridges;
