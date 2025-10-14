import React from 'react';
import { Empty, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import BatchesCard from '../../../cards/BatchesCard';
import { FancySpinner } from '../../../shared';
import { DEFAULT_COLORS } from '../../../../constants';
import type { BatchWorkloadCardData } from '../../../../interfaces/workload';

const { Title } = Typography;

interface BatchesListProps {
  batches: BatchWorkloadCardData[];
  loading?: boolean;
  onBatchClick?: (batch: BatchWorkloadCardData) => void;
}

const BatchesList: React.FC<BatchesListProps> = ({ batches, loading = false, onBatchClick }) => {
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          width: '100%',
        }}
      >
        <FancySpinner label="Loading batches…" showLabel={true} />
      </div>
    );
  }

  if (batches.length === 0) {
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
            fontSize: 24,
          }}
        >
          <ClockCircleOutlined />
        </div>
        <Title level={4} style={{ marginBottom: 8, color: '#0B1F33' }}>
          No Batches Yet
        </Title>
        <div style={{ color: '#5B6B7C', maxWidth: 400, lineHeight: 1.6 }}>
          This feature is currently under development.
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {batches.map((batch) => (
        <BatchesCard key={batch.name} batch={batch} onClick={() => onBatchClick?.(batch)} />
      ))}
    </div>
  );
};

export default BatchesList;
