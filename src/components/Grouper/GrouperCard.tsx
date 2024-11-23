import React, { useState } from 'react';
import { Card, Typography, Button, Tag, Popover, Modal, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SyncOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface GrouperCardProps {
  title: string;
  status: 'Active' | 'Inactive';
  numberOfWorkloads: number;
  numberOfBridges: number;
  description: string;
  creationTime: string;
  icon: JSX.Element;
  namespace: string;
}

const GrouperCard: React.FC<GrouperCardProps> = ({
  title,
  status,
  numberOfWorkloads,
  numberOfBridges,
  description,
  creationTime,
  icon,
  namespace,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const getStatusStyle = (status: 'Active' | 'Inactive') => {
    return status === 'Active'
      ? { color: '#20C997', borderColor: '#20C997', icon: <CheckCircleOutlined style={{ marginRight: '4px' }} /> }
      : { color: '#999', borderColor: '#999', icon: <CloseCircleOutlined style={{ marginRight: '4px' }} /> };
  };

  const statusStyle = getStatusStyle(status);

  // Sync action handler
  const handleSync = () => {
    message.success('Sync action completed successfully!');
  };

  // View action handler
  const handleView = () => {
    navigate(`/groupers/${namespace}/details`);
  };

  // Delete action handlers
  const handleDelete = () => {
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setModalVisible(false);
    message.warning('Grouper deleted successfully.');
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* Modal for delete confirmation */}
      <Modal
        title="Delete Grouper"
        visible={isModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        Are you sure you want to delete this Grouper?
      </Modal>

      <Card
        style={{
          width: '100%',
          marginBottom: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)', // Reduced shadow opacity
          border: '1px solid #f0f0f0',
          padding: '12px',
          position: 'relative',
          fontFamily: 'Inter, Roboto, Open Sans, sans-serif',
        }}
        bodyStyle={{ paddingBottom: '8px' }} // Reduced bottom padding
        actions={[
          <Popover content="View Details" trigger="hover">
          <EyeOutlined
            key="view"
            style={{
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.3s',
            }}
            onClick={handleView}
            onMouseOver={(e) => (e.currentTarget.style.color = statusStyle.color)}
            onMouseOut={(e) => (e.currentTarget.style.color = '')}
          />
          </Popover>,
          <Popover content="Sync Grouper" trigger="hover">
          <SyncOutlined
            key="sync"
            style={{
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'color 0.3s',
            }}
            onClick={handleSync}
            onMouseOver={(e) => (e.currentTarget.style.color = statusStyle.color)}
            onMouseOut={(e) => (e.currentTarget.style.color = '')}
          />
          </Popover>,
          <Popover content="Delete Grouper" trigger="hover">
          <DeleteOutlined
            key="delete"
            style={{
              fontSize: '16px',
              cursor: 'pointer',
              color: '#ff4d4f',
              transition: 'color 0.3s',
            }}
            onClick={handleDelete}
            onMouseOver={(e) => (e.currentTarget.style.color = statusStyle.color)}
            onMouseOut={(e) => (e.currentTarget.style.color = '#ff4d4f')}
          />
          </Popover>,
        ]}
      >
        {/* Top-right Section: Status Button and Info Icon */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          {/* Information Icon with Popover */}
          <Popover content="Grouper presents Namespace" trigger="hover">
            <InfoCircleOutlined style={{ fontSize: '16px', color: '#888', cursor: 'pointer' }} />
          </Popover>
        </div>

        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          {/* Icon */}
          <div
            style={{
              backgroundColor: statusStyle.color,
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {React.cloneElement(icon, { style: { fontSize: '18px', color: '#fff' } })}
          </div>

          {/* Title and Demo Description */}
          <div>
            <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: '600', lineHeight: '20px' }}>
              {title}
            </Title>
            <Text style={{ marginTop: '2px', color: '#999', fontSize: '12px' }}>{description}</Text>
          </div>
        </div>

        {/* Metrics Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1px',
            gap: '24px',
            paddingTop: '16px',
          }}
        >
          {/* Workloads Metric */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{numberOfWorkloads}</Text>
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Workloads</Text>
              <Text style={{ fontSize: '10px', color: '#888', marginTop: '-px', display: 'block' }}>
                From Last Sync
              </Text>
            </div>
          </div>

          {/* Bridges Metric */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{numberOfBridges}</Text>
            <div>
              <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>Bridges</Text>
              <Text style={{ fontSize: '10px', color: '#888', marginTop: '-5px', display: 'block' }}>
                From Last Sync
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default GrouperCard;
