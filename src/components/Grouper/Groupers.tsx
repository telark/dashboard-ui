import React, { useState, useEffect, useCallback } from 'react';

import { Row, Col, Spin, message, Empty } from 'antd';
import { LoadingOutlined, AppstoreOutlined } from '@ant-design/icons';

import { fetchGroupers } from '../../clients/grouper';
import { mapGroupersData } from '../../utils/mappers/grouper';
import GrouperCard from '../Cards/GrouperCard';

import { DEFAULT_POLLING_INTERVAL, DEFAULT_COLORS } from "../../config";


const Groupers: React.FC = () => {
  const [groupers, setGroupers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroupers = useCallback(async () => {
    try {
      const rawGroupersData = await fetchGroupers();
      const formattedGroupersData = mapGroupersData(rawGroupersData);

      // Compare old and new data to avoid unnecessary updates
      const isDataChanged = JSON.stringify(groupers) !== JSON.stringify(formattedGroupersData);

      if (isDataChanged) {
        setGroupers(formattedGroupersData);
      }
    } catch (error: any) {
      // Display error message only once
      const errorMessage = error.message || 'Failed to load data.';
      message.error(errorMessage);
      setError(errorMessage); // Set error state if needed
      
    } finally {
      setLoading(false);
    }
  }, [groupers]);

  useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      if (!isMounted) return;
      await loadGroupers();
    };

    // Initial load
    fetchData();

    /// Polling interval
    const interval = setInterval(fetchData, DEFAULT_POLLING_INTERVAL);

    // Cleanup
    return () => {
      isMounted = false; // Prevent updates on unmounted component
      clearInterval(interval);
    };
  }, [loadGroupers]);

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
    <div style={{ padding: '20px', margin: "auto" }}>
      {groupers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Empty
            image={<AppstoreOutlined style={{ fontSize: '64px', color: DEFAULT_COLORS.DEFAULT }} />}
            description={
              <span style={{ fontSize: '18px', color: '#555' }}>
                No Apps Found
              </span>
            }
          />
        </div>
      ) : (
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {groupers.map((grouper, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <GrouperCard {...grouper} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Groupers;
