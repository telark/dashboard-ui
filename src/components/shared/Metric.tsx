import React from 'react';
import { Typography } from 'antd';
import { MetricInterface } from '../../interfaces/shared';

const { Text } = Typography;

const Metric: React.FC<MetricInterface> = ({ label, value }) => (
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

export default Metric;
