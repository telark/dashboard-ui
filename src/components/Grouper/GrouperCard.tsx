// src/components/GrouperCard/GrouperCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, Modal, message, Popover } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, EyeOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import StatusButton from '../Common/StatusButton';
import Metrics from '../Common/Metrics';

const { Title, Text } = Typography;

interface GrouperCardProps {
  title: string;
  status: 'Active' | 'Inactive';
  numberOfWorkloads: number;
  numberOfBridges: number;
  creationTimeForTA: Date;
  creationTime: string;
  lastUpdateTime: string;
  icon: JSX.Element;
  namespace: string;
  history: any[];
  sync: any;
}

const GrouperCard: React.FC<GrouperCardProps> = ({
  title,
  status,
  numberOfWorkloads,
  numberOfBridges,
  creationTimeForTA,
  creationTime,
  lastUpdateTime,
  icon,
  namespace,
  history,
  sync,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [formattedCreationTime, setFormattedCreationTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateTimeAgo = () => {
      if (creationTimeForTA) {
        setFormattedCreationTime(formatDistanceToNow(new Date(creationTimeForTA), { addSuffix: true }));
      } else {
        setFormattedCreationTime('Invalid Date');
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [creationTimeForTA]);

  const statusStyle = status === 'Active'
    ? { color: '#20C997', borderColor: '#20C997', icon: <CheckCircleOutlined /> }
    : { color: '#999', borderColor: '#999', icon: <CloseCircleOutlined /> };

  const handleSync = () => message.success('Sync action completed successfully!');
  const handleView = () => navigate(`/groupers/${title}/details`, { state: { title, status, creationTime, lastUpdateTime, history, sync } });
  const handleDelete = () => setModalVisible(true);
  const handleConfirmDelete = () => {
    setModalVisible(false);
    message.warning('Grouper deleted successfully.');
  };
  const handleCancelDelete = () => setModalVisible(false);

  return (
    <>
      {/* Modal for delete confirmation */}
      <Modal
        title="Delete Grouper"
        open={isModalVisible}
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
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
          padding: '12px',
          position: 'relative',
          fontFamily: 'Inter, Roboto, Open Sans, sans-serif',
        }}
        styles={{ body: {paddingBottom: '18px' }}}
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
          <StatusButton status={status} icon={statusStyle.icon} />
          <Popover content="Grouper presents Namespace" trigger="hover">
            <InfoCircleOutlined style={{ fontSize: '16px', color: '#888', cursor: 'pointer' }} />
          </Popover>
        </div>

        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
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

          <div>
            <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: '600', lineHeight: '20px' }}>
              {title}
            </Title>
            <Text style={{ marginTop: '2px', color: '#999', fontSize: '12px' }}>{formattedCreationTime}</Text>
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
              <Metrics label="Workloads" value={numberOfWorkloads} />
              <Metrics label="Bridges" value={numberOfBridges} />
             </div>
      </Card>
    </>
  );
};

export default GrouperCard;
