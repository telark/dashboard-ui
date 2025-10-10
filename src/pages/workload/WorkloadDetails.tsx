import React, { useEffect, useState, useCallback } from 'react';
import {
  message,
  Spin,
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Descriptions,
  Table,
  Space,
  Button,
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchWorkloads } from '../../clients/exporter';
import type { Workload } from '../../interfaces/workload';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text } = Typography;

const WorkloadDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [workload, setWorkload] = useState<Workload | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWorkloadDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWorkloads();
      const foundWorkload = response.data.items.find((w: Workload) => w.fasid.name === name);

      if (!foundWorkload) {
        message.error('Workload not found');
        navigate('/workloads');
        return;
      }

      setWorkload(foundWorkload);
    } catch (error: any) {
      console.error('Failed to fetch workload details:', error);
      message.error('Failed to load workload details');
    } finally {
      setLoading(false);
    }
  }, [name, navigate]);

  useEffect(() => {
    if (name) {
      loadWorkloadDetails();
    }
  }, [name, loadWorkloadDetails]);

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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!workload) {
    return <div>Workload not found</div>;
  }

  const containerColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'subType',
      key: 'subType',
    },
    {
      title: 'Image',
      key: 'image',
      render: (record: any) => record.image ? `${record.image.name}:${record.image.tag}` : 'N/A',
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
  ];

  const instanceColumns = [
    {
      title: 'Instance',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'CPU',
      dataIndex: 'totalCpu',
      key: 'totalCpu',
    },
    {
      title: 'Memory',
      dataIndex: 'totalMemory',
      key: 'totalMemory',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Space align="center" style={{ marginBottom: '8px' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/workloads')} type="text">
            Back
          </Button>
        </Space>
        <Title level={2}>{workload.fasid.name}</Title>
        <Text type="secondary">Workload in {workload.fasid.grouper} grouper</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Basic Information */}
        <Col span={24}>
          <Card title="Basic Information">
            <Descriptions column={2}>
              <Descriptions.Item label="Name">{workload.fasid.name}</Descriptions.Item>
              <Descriptions.Item label="Grouper">{workload.fasid.grouper}</Descriptions.Item>
              <Descriptions.Item label="Source Type">{workload.fasid.sourceType}</Descriptions.Item>
              <Descriptions.Item label="Source Name">{workload.fasid.sourceName}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(workload.cacid.status)}>{workload.cacid.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Registry">
                <Tag color={getRegistryColor(workload.cacid.registry)}>
                  {workload.cacid.registry}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Strategy">{workload.cacid.strategy}</Descriptions.Item>
              <Descriptions.Item label="Creation Time">
                {formatTime(workload.fasid.creationTime)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Instances */}
        <Col span={12}>
          <Card title="Instances">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Total: </Text>
                <Text>{workload.cacid.instances?.total || 0}</Text>
              </div>
              <div>
                <Text strong>Available: </Text>
                <Text>{workload.cacid.instances?.available || 0}</Text>
              </div>
              <div>
                <Text strong>Names: </Text>
                <Text>{workload.cacid.instances?.names?.join(', ') || 'None'}</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Usage */}
        <Col span={12}>
          <Card title="Resource Usage">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>QoS: </Text>
                <Text>{workload.cacid.usage?.qos || 'Unknown'}</Text>
              </div>
              <div>
                <Text strong>Total CPU: </Text>
                <Text>{workload.cacid.usage?.resources?.totalCpu || 'Unknown'}</Text>
              </div>
              <div>
                <Text strong>Total Memory: </Text>
                <Text>{workload.cacid.usage?.resources?.totalMemory || 'Unknown'}</Text>
              </div>
              <div>
                <Text strong>Last Updated: </Text>
                <Text>{workload.cacid.usage?.timestamp ? formatTime(workload.cacid.usage.timestamp) : 'Unknown'}</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Containers */}
        <Col span={24}>
          <Card title="Containers">
            <Table
              dataSource={workload.cacid.crates?.regular || []}
              columns={containerColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>

        {/* Instance Usage */}
        <Col span={24}>
          <Card title="Instance Resource Usage">
            <Table
              dataSource={workload.cacid.usage?.resources?.usagePerInstance || []}
              columns={instanceColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>

        {/* Events */}
        <Col span={24}>
          <Card title="Events">
            {workload.cacid.events && workload.cacid.events.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                {workload.cacid.events.map((event, index) => (
                  <div key={index}>
                    <Text strong>{event.instance}</Text>
                    {event.events && event.events.length > 0 ? (
                      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                        {event.events.map((e, eventIndex) => (
                          <li key={eventIndex}>
                            <Text type="secondary">
                              {e.type}: {e.reason} - {e.message}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Text type="secondary" style={{ display: 'block', marginLeft: '16px' }}>
                        No events
                      </Text>
                    )}
                  </div>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No events</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WorkloadDetails;
