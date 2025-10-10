import React from 'react';
import { Card, Tag, Space, Typography, Row, Col, Statistic } from 'antd';
import { DeploymentUnitOutlined, DatabaseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { WorkloadCardData } from '../../interfaces/workload';
import { formatDistanceToNow } from 'date-fns';

const { Text, Title } = Typography;

interface WorkloadCardProps {
  workload: WorkloadCardData;
  onClick?: () => void;
}

const WorkloadCard: React.FC<WorkloadCardProps> = ({ workload, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'running':
        return 'processing';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRegistryColor = (registry: string) => {
    switch (registry.toLowerCase()) {
      case 'private':
        return 'blue';
      case 'public':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ marginBottom: 16, cursor: onClick ? 'pointer' : 'default' }}
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space align="center">
              <DeploymentUnitOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <Title level={5} style={{ margin: 0 }}>
                {workload.name}
              </Title>
            </Space>
            <Tag color={getStatusColor(workload.status)}>{workload.status}</Tag>
          </Space>
        </Col>

        <Col span={24}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              <Text type="secondary">Grouper:</Text>
              <Text strong>{workload.grouper}</Text>
            </Space>
            <Space>
              <Text type="secondary">Source:</Text>
              <Text>{workload.sourceType}</Text>
            </Space>
          </Space>
        </Col>

        <Col span={24}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="Instances"
                value={workload.instances.available}
                suffix={`/ ${workload.instances.total}`}
                valueStyle={{ fontSize: '16px' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Containers"
                value={workload.containers}
                valueStyle={{ fontSize: '16px' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Strategy"
                value={workload.strategy}
                valueStyle={{ fontSize: '14px' }}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <DatabaseOutlined />
              <Tag color={getRegistryColor(workload.registry)}>{workload.registry}</Tag>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {formatTime(workload.lastUpdate)}
              </Text>
            </Space>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default WorkloadCard;
