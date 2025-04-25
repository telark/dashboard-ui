import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Modal, message, Popover } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SyncOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import StatusButton from '../Buttons/StatusButton';
import TimeAgo from '../Time/TimeAgo';
import Metric from '../Common/Metric';
import { DEFAULT_COLORS } from '../../constants';
import { GrouperInterface } from '../../interfaces/grouper';
import { CapitalizeFirstLetter } from '../../utils/helpers/index';

const { Title, Text } = Typography;

const GrouperCard: React.FC<GrouperInterface> = ({
  name = 'Unknown',
  maintenance = null,
  status = 'Inactive',
  numberOfWorkloads = 0,
  numberOfBridges = 0,
  creationTime = '',
  icon,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const statusStyle =
    status === 'Active'
      ? {
          color: DEFAULT_COLORS.SUCCESS,
          borderColor: DEFAULT_COLORS.SUCCESS,
          icon: <CheckCircleOutlined />,
        }
      : {
          color: DEFAULT_COLORS.DEFAULT,
          borderColor: DEFAULT_COLORS.DEFAULT,
          icon: <CloseCircleOutlined />,
        };

  const handleSync = () => message.success('Sync Completed Successfully!');
  const handleView = () => navigate(`/groupers/${name}/details`);
  const handleDelete = () => setModalVisible(true);
  const handleConfirmDelete = () => {
    setModalVisible(false);
    message.warning('Grouper deleted successfully.');
  };
  const handleCancelDelete = () => setModalVisible(false);

  return (
    <>
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
          maxWidth: '600px',
          borderRadius: '20px',
          boxShadow: '0 10px 24px rgba(0, 0, 0, 0.08)',
          border: 'none',
          padding: '28px',
          position: 'relative',
          background: 'linear-gradient(145deg, #ffffff, #f4f6f9)',
          transition: 'transform 0.2s ease-in-out',
        }}
        hoverable
        actions={[
          <Popover content="View Details" trigger="hover">
            <EyeOutlined
              key="view"
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'color 0.3s, transform 0.3s',
              }}
              onClick={handleView}
              onMouseOver={(e) => {
                e.currentTarget.style.color = statusStyle.color;
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </Popover>,
          <Popover content="Sync Grouper" trigger="hover">
            <SyncOutlined
              key="sync"
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'color 0.3s, transform 0.3s',
              }}
              onClick={handleSync}
              onMouseOver={(e) => {
                e.currentTarget.style.color = statusStyle.color;
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </Popover>,
          <Popover content="Delete Grouper" trigger="hover">
            <DeleteOutlined
              key="delete"
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                color: DEFAULT_COLORS.ERROR,
                transition: 'color 0.3s, transform 0.3s',
              }}
              onClick={handleDelete}
              onMouseOver={(e) => {
                e.currentTarget.style.color = statusStyle.color;
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = DEFAULT_COLORS.ERROR;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </Popover>,
        ]}
      >
        {/* Top-right icons */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            zIndex: 2,
          }}
        >
          <StatusButton status={status} icon={statusStyle.icon} />
          {maintenance?.status === 'Active' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fef4e5',
                color: '#faad14',
                padding: '6px 12px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              <WarningOutlined style={{ fontSize: '18px' }} />
              Maintenance Mode
            </div>
          )}
          <Popover content="Grouper presents Namespace" trigger="hover">
            <InfoCircleOutlined style={{ fontSize: '16px', color: '#888', cursor: 'pointer' }} />
          </Popover>
        </div>

        {/* Card Main Content */}
        <div style={{ marginTop: '20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                backgroundColor: statusStyle.color,
                padding: '12px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {React.cloneElement(icon, { style: { fontSize: '20px', color: '#fff' } })}
            </div>
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '17px', fontWeight: '600' }}>
                {CapitalizeFirstLetter(name)}
              </Title>
              <Text style={{ color: DEFAULT_COLORS.DEFAULT, fontSize: '12px' }}>
                <TimeAgo date={creationTime} />
              </Text>
            </div>
          </div>

          {/* Metrics */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '18px',
              gap: '24px',
            }}
          >
            <Metric label="Workloads" value={numberOfWorkloads} />
            <Metric label="Bridges" value={numberOfBridges} />
          </div>
        </div>
      </Card>
    </>
  );
};

export default GrouperCard;
