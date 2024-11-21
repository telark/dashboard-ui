import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Spin } from 'antd';
import GrouperCard from './GrouperCard'; // Assuming you have a GrouperCard component
import { fetchGroupersData } from '../../services/api'; // Import the API function

interface Grouper {
  title: string;
  status: string;
  numberOfWorkloads: number;
  numberOfBridges: number;
  kind: string;
  creationTime: string;
}

const Groupers: React.FC = () => {
  const [groupers, setGroupers] = useState<Grouper[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dummyData: Grouper[] = [
    {
      title: "Test Grouper 1",
      status: "Active",
      numberOfWorkloads: 1,
      numberOfBridges: 2,
      kind: "Namespace",
      creationTime: "2024-08-27 15:03:24"
    },
    {
      title: "Test Grouper 2",
      status: "Inactive",
      numberOfWorkloads: 2,
      numberOfBridges: 1,
      kind: "Namespace",
      creationTime: "2024-08-27 15:03:26"
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('http://localhost:56085/api/v1/scopes/groupers/fetch');
        
        // Check the response status code
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Debugging: Log the raw response to the console
        console.log('API Response:', data);

        if (data?.response_status === 200 && data.items?.items.length > 0) {
          const groupersData = data.items.items.map((item: any) => ({
            title: item.fasid.source.name,
            status: item.cacid.status,
            numberOfWorkloads: item.cacid.workloads.length,
            numberOfBridges: item.cacid.bridges.length,
            kind: item.fasid.source.kind,
            creationTime: new Date(item.fasid.source.creationTime).toLocaleString()
          }));
          
          setGroupers(groupersData);
        } else {
          setGroupers(dummyData);
        }
      } catch (error: any) {
        // Log the error to the console for debugging
        console.error("Error fetching groupers:", error);
        setError("Failed to load data.");
        setGroupers(dummyData); // Use dummy data in case of error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Input placeholder="Search by job title, company, keywords" />
        </Col>
        <Col span={12}>
          <Button type="primary" style={{ width: '100%' }}>
            Filters
          </Button>
        </Col>
      </Row>

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
            <Col span={8} key={index}>
              <GrouperCard {...grouper} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Groupers;
