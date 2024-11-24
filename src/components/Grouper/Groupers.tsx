import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import GrouperCard from './GrouperCard';
import { fetchGroupers } from '../../clients/grouper';
import { mapGroupersData } from '../../utils/mapper';

const POLLING_INTERVAL = 60000; // 1 minute

const Groupers: React.FC = () => {
  const [groupers, setGroupers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroupers = async () => {
    try {
      const rawGroupersData = await fetchGroupers();
      const formattedGroupersData = mapGroupersData(rawGroupersData);

      // Compare old and new data to avoid unnecessary updates
      const isDataChanged =
        JSON.stringify(groupers) !== JSON.stringify(formattedGroupersData);

      if (isDataChanged) {
        setGroupers(formattedGroupersData);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load data.');
      message.error(error.message || 'Failed to load groupers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadGroupers();

    // Polling interval
    const interval = setInterval(() => {
      loadGroupers();
    }, POLLING_INTERVAL);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'red', padding: '20px' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', marginTop: '50px' }}>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {groupers.map((grouper, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <GrouperCard {...grouper} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Groupers;
