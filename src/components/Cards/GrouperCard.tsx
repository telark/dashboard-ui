import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Typography, Modal, message, Popover } from 'antd';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined, 
  EyeOutlined, 
  SyncOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';

import StatusButton from '../Common/StatusButton';
import TimeAgo from "../Time/TimeAgo";
import Metric from '../Common/Metric';
import { DEFAULT_COLORS } from "../../config";
import { GrouperInterface } from "../../interfaces/grouper";


const { Title, Text } = Typography;


const GrouperCard: React.FC<GrouperInterface> = ({
  name,
  status,
  numberOfWorkloads,
  numberOfBridges,
  creationTime,
  lastUpdateTime,
  icon,
  history,
  sync,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();


  const statusStyle = status === 'Active'
    ? { color: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS, icon: <CheckCircleOutlined /> }
    : { color: DEFAULT_COLORS.DEFAULT, borderColor: DEFAULT_COLORS.DEFAULT, icon: <CloseCircleOutlined /> };

  const handleSync = () => message.success('Sync Completed Successfully!');
  const handleView = () => navigate(`/groupers/${name}/details`, { state: { name, status, creationTime, lastUpdateTime, history, sync } });
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
              color: DEFAULT_COLORS.ERROR,
              transition: 'color 0.3s',
            }}
            onClick={handleDelete}
            onMouseOver={(e) => (e.currentTarget.style.color = statusStyle.color)}
            onMouseOut={(e) => (e.currentTarget.style.color = DEFAULT_COLORS.ERROR)}
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
              {name}
            </Title>
            <Text style={{ marginTop: '2px', color: DEFAULT_COLORS.DEFAULT, fontSize: '12px' }}><TimeAgo date={creationTime}></TimeAgo></Text>
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
              <Metric label="Workloads" value={numberOfWorkloads} />
              <Metric label="Bridges" value={numberOfBridges} />
             </div>
      </Card>
    </>
  );
};

export default GrouperCard;