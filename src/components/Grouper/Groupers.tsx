import React, { useState, useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import GrouperCard from './GrouperCard';
import { ApartmentOutlined, ShopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const Groupers: React.FC = () => {
  const [groupers, setGroupers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('http://localhost:51328/api/v1/scopes/groupers/fetch');
  
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        if (data?.response_status === 200 && data.items?.items.length > 0) {
          const groupersData = data.items.items.map((item: any) => ({
            title: item.fasid.source.name,
            status: item.cacid.status,
            numberOfWorkloads: item.cacid.workloads.length || 0, // Directly extract number of Workloads
            numberOfBridges: item.cacid.bridges?.length || 0, // Directly extract number of Bridges (Products)
            tags: [item.fasid.source.kind],
            description: `Created on ${new Date(item.fasid.source.creationTime).toLocaleString()}`,
            creationTime: item.fasid.source.creationTime,
            icon: <ApartmentOutlined style={{ fontSize: '15px', color: '#20C997' }} />, // Assuming the same icon for all
          }));
          setGroupers(groupersData);
        } else {
          setError('Failed to load data.');
        }
      } catch (error: any) {
        console.error('Error fetching groupers:', error);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  

  return (
    <div style={{ padding: '20px', marginTop: '50px' }}>

      {loading ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ marginTop: '20px', textAlign: 'center', color: 'red' }}>
          {error}
        </div>
      ) : (
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {groupers.map((grouper, index) => (
            <Col span={24} key={index}> {/* Full row width */}
              <GrouperCard {...grouper} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Groupers;
