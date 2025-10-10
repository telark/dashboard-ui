import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Dropdown } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DeploymentUnitOutlined,
  EyeOutlined,
  SyncOutlined,
  DeleteOutlined,
  MoreOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import StatusButton from '../buttons/StatusButton';
import TimeAgo from '../time/TimeAgo';
import Metric from '../common/Metric';
import {
  DEFAULT_COLORS,
  CARD_CONFIGS,
  CARD_COLORS,
  CARD_TRANSITIONS,
  CARD_EFFECTS,
  CARD_STATES,
  CARD_DEFAULTS,
} from '../../constants';
import { UI } from '../../constants/ui';
import type { WorkloadCardData } from '../../interfaces/workload';
import { CapitalizeFirstLetter } from '../../utils/helpers';

const { Title, Text } = Typography;

interface WorkloadCardProps {
  workload: WorkloadCardData;
  onClick?: () => void;
}

const WorkloadCard: React.FC<WorkloadCardProps> = ({ workload, onClick }) => {
  const navigate = useNavigate();

  const statusStyle = useMemo(
    () =>
      workload.status === 'Available'
        ? {
            color: DEFAULT_COLORS.SUCCESS,
            borderColor: DEFAULT_COLORS.SUCCESS,
            icon: <CheckCircleOutlined />,
          }
        : workload.status === 'Running'
        ? {
            color: '#1890ff',
            borderColor: '#1890ff',
            icon: <WarningOutlined />,
          }
        : {
            color: DEFAULT_COLORS.DEFAULT,
            borderColor: DEFAULT_COLORS.DEFAULT,
            icon: <CloseCircleOutlined />,
          },
    [workload.status],
  );

  const handleView = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/workloads/${workload.name}/details`);
    }
  };

  const handleSync = () => {
    // Placeholder for sync functionality
    console.log('Sync workload:', workload.name);
  };

  const handleDelete = () => {
    // Placeholder for delete functionality
    console.log('Delete workload:', workload.name);
  };

  const menuItems = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Details',
      onClick: handleView,
    },
    {
      key: 'sync',
      icon: <SyncOutlined />,
      label: 'Sync Workload',
      onClick: handleSync,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete Workload',
      onClick: handleDelete,
      danger: true,
    },
  ];

  return (
    <Card
      style={{
        width: '100%',
        borderRadius: CARD_CONFIGS.GROUPER_CARD.BORDER_RADIUS,
        boxShadow: CARD_COLORS.SHADOW.CARD,
        border: 'none',
        position: 'relative',
        background: CARD_COLORS.BACKGROUND.DEFAULT,
        transition: CARD_TRANSITIONS.CARD,
        marginBottom: '16px',
      }}
      styles={{ body: { padding: '16px 24px' } }}
      hoverable
    >
      {/* Single Row Layout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Left side - Icon + Name + Grouper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: CARD_CONFIGS.GROUPER_CARD.HEADER_GAP,
          }}
        >
          <div
            style={{
              backgroundColor: CARD_COLORS.ICON.BACKGROUND,
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: CARD_COLORS.ICON.SHADOW,
            }}
          >
            <span
              style={{ display: 'inline-flex', fontSize: '18px', color: DEFAULT_COLORS.SUCCESS }}
            >
              <DeploymentUnitOutlined />
            </span>
          </div>
          <div>
            <Title
              level={5}
              style={{
                margin: 0,
                fontSize: CARD_CONFIGS.GROUPER_CARD.TITLE_FONT_SIZE,
                fontWeight: '600',
              }}
            >
              {CapitalizeFirstLetter(workload.name)}
            </Title>
            <Text
              style={{
                color: DEFAULT_COLORS.DEFAULT,
                fontSize: CARD_CONFIGS.GROUPER_CARD.DESCRIPTION_FONT_SIZE,
              }}
            >
              {UI.CARD.LAST_UPDATE_PREFIX} <TimeAgo date={workload.lastUpdate} />
            </Text>
          </div>
        </div>

        {/* Right side - Metrics + Status + Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Metrics */}
          <div
            style={{
              display: 'flex',
              gap: CARD_CONFIGS.GROUPER_CARD.METRICS_GAP,
            }}
          >
            <Metric label="Instances" value={workload.instances.available} />
            <Metric label="Containers" value={workload.containers} />
            <Metric label="Attached Bridges" value={workload.bridges || 0} />
          </div>

          {/* Grouper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#f0f8ff',
              padding: '4px 8px',
              borderRadius: '12px',
              border: '1px solid #d6e4ff',
            }}
          >
            <AppstoreOutlined
              style={{
                fontSize: '12px',
                color: '#1890ff',
              }}
            />
            <Text
              style={{
                fontSize: '11px',
                color: '#1890ff',
                fontWeight: '500',
              }}
            >
              {workload.grouper}
            </Text>
          </div>

          {/* Status */}
          <StatusButton status={workload.status === 'Available' ? 'Active' : 'Inactive'} icon={statusStyle.icon} />

          {/* Dropdown */}
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <MoreOutlined
              style={{
                fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
                color: CARD_COLORS.TEXT.INFO,
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: CARD_TRANSITIONS.ICON,
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            />
          </Dropdown>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(WorkloadCard);
