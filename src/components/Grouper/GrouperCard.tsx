import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

// Define the structure of the props that GrouperCard expects
interface GrouperCardProps {
  title: string;
  status: string;
  numberOfWorkloads: number;
  numberOfBridges: number;
  kind: string;
  creationTime: string;
}

const GrouperCard: React.FC<GrouperCardProps> = ({ title, status, numberOfWorkloads, numberOfBridges, kind, creationTime }) => {
  return (
    <Card style={{ width: '100%', marginBottom: '20px' }} hoverable>
      <Title level={4}>{title}</Title>
      <Text>Status: {status}</Text>
      <br />
      <Text>Number Of Workloads: {numberOfWorkloads}</Text>
      <br />
      <Text>Number Of Bridges: {numberOfBridges}</Text>
      <br />
      <Text>Kind: {kind}</Text>
      <br />
      <Text type="secondary">Created: {creationTime}</Text>
    </Card>
  );
};

export default GrouperCard;
