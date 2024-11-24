// src/components/GrouperCard/Metrics.tsx
import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface MetricsProps {
  label: string;
  value: number;
}

const Metrics: React.FC<MetricsProps> = ({ label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{value}</Text>
    <div>
      <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>{label}</Text>
      <Text style={{ fontSize: '10px', color: '#888', marginTop: '-5px', display: 'block' }}>
        From Last Sync
      </Text>
    </div>
    </div>
);

export default Metrics;