import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Spin } from 'antd'; // Import Ant Design components
import GrouperCard from './GrouperCard'; // Assuming you have a GrouperCard component
import { fetchGroupersData } from '../../services/api'; // Import the API function

// Define the structure of each grouper
interface Grouper {
  title: string;
  company: string;
  location: string;
  salary: string;
  timeAgo: string;
  status: string;
}

const Groupers: React.FC = () => {
  const [groupers, setGroupers] = useState<Grouper[]>([]); // State to store the fetched groupers
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGroupersData(); // Call the API to fetch groupers data
      setGroupers(data); // Set the state with the fetched data
      setLoading(false); // Set loading to false after data is fetched
    };

    loadData(); // Call the function to load data
  }, []); // Empty dependency array means it runs once on mount

  return (
    <div style={{ padding: '20px' }}>
      {/* Search and Filter section */}
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

      {/* Display loading spinner while data is being fetched */}
      {loading ? (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {/* Map the data to GrouperCard components */}
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
