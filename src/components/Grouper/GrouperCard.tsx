import React from 'react';
import { Card, Typography } from 'antd';

// Destructure necessary components from Ant Design
const { Title, Text } = Typography;

// Define the structure of the props that GrouperCard expects
interface GrouperCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  timeAgo: string;
  status: string;
}

const GrouperCard: React.FC<GrouperCardProps> = ({ title, company, location, salary, timeAgo, status }) => {
  return (
    <Card style={{ width: '100%', marginBottom: '20px' }} hoverable>
      <Title level={4}>{title}</Title>
      <Text>{company}</Text>
      <br />
      <Text>{location}</Text>
      <br />
      <Text strong>{salary}</Text>
      <br />
      <Text type="secondary">{timeAgo}</Text>
      <br />
      <Text style={{ color: status === 'Active' ? 'green' : 'red' }}>{status}</Text>
    </Card>
  );
};

export default GrouperCard;
