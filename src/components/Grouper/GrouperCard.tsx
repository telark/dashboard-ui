import React from 'react';
import { Card, Typography, Button, Space, Dropdown, Menu, Tag, Row, Col } from 'antd';
import { EllipsisOutlined, ApartmentOutlined, ShoppingFilled, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface GrouperCardProps {
  title: string;
  status: 'Active' | 'Inactive';
  numberOfWorkloads: number;
  numberOfBridges: number;
  tags: string[];
  description: string;
  creationTime: string;
  icon: JSX.Element;
}

const GrouperCard: React.FC<GrouperCardProps> = ({
  title,
  status,
  numberOfWorkloads,
  numberOfBridges,
  tags,
  description,
  creationTime,
  icon,
}) => {
  const dropdownMenu = (
    <Menu>
      <Menu.Item key="1">View Details</Menu.Item>
      <Menu.Item key="2">Edit</Menu.Item>
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  );

  const getStatusStyle = (status: 'Active' | 'Inactive') => {
    return status === 'Active'
      ? { color: '#20C997', borderColor: '#20C997', icon: <CheckCircleOutlined style={{ marginRight: '4px' }} /> }
      : { color: '#999', borderColor: '#999', icon: <CloseCircleOutlined style={{ marginRight: '4px' }} /> };
  };

  const statusStyle = getStatusStyle(status);

  return (
    <Card
      style={{
        width: '100%',
        marginBottom: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f0f0f0',
        padding: '16px',
        position: 'relative', // To position metrics at the bottom
      }}
    >
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Section: Icon, Title, Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Namespace Icon */}
          <div
            style={{
              backgroundColor: '#e6f7ff',
              padding: '12px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {icon}
          </div>
          {/* Title and Description */}
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {title}
            </Title>
            <div style={{ marginTop: '1px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((tag, index) => (
              <Tag key={index} color="blue">{tag}</Tag>
        ))}
      </div>
          </div>
        </div>
        {/* Right Section: Status Button and Three-Dot Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            type="default"
            style={{
              color: statusStyle.color,
              borderColor: statusStyle.borderColor,
              borderRadius: '25px',
              padding: '0 12px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {statusStyle.icon} {status}
          </Button>
          <Dropdown overlay={dropdownMenu} trigger={['click']}>
            <EllipsisOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </div>
      {/* Metrics Section - Workloads and Products */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', right: '16px', }}>
        <Col span={7} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Left: Number for Workloads */}
          <div
            style={{
              fontSize: '20px',  // Reduced font size for closer spacing
              fontWeight: 'bold',
              textAlign: 'center',
              width: '5%',
            }}
          >
            {numberOfWorkloads}
          </div>
          {/* Right: Workloads Label */}
          <div style={{ width: '50%' }}>
            <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Workloads</Text>
            <Text style={{ display: 'block', fontSize: '10px', color: '#888', marginTop: -6 }}>From Last Sync</Text>
          </div>
        </Col>
        <Col span={7} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Left: Number for Products */}
          <div
            style={{
              fontSize: '20px',  // Reduced font size for closer spacing
              fontWeight: 'bold',
              textAlign: 'center',
              width: '5%',
            }}
          >
            {numberOfBridges}
          </div>
          {/* Right: Bridges (Products) Label */}
          <div style={{ width: '50%' }}>
            <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Bridges</Text>
            <Text style={{ display: 'block', fontSize: '10px', color: '#888', marginTop: -6 }}>From Last Sync</Text>
          </div>
        </Col>
      </div>
    </Card>
  );
};

export default GrouperCard;
