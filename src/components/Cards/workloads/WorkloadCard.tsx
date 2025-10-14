import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { 
  DeploymentUnitOutlined,
  AppstoreOutlined 
} from '@ant-design/icons';

import { DEFAULT_COLORS } from '../../../constants';
import { AppWorkloadCardData } from '../../../interfaces/workload';
import { getDetailedStatusStyle, normalizeStatus } from '../../../utils/statusUtils';
import { ResourceCard, ResourceCardData, ResourceCardActions, ResourceCardConfig } from '../shared';

interface WorkloadCardProps {
  workload: AppWorkloadCardData;
  onClick?: () => void;
}

const WorkloadCard: React.FC<WorkloadCardProps> = ({ workload, onClick }) => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const statusStyle = useMemo(() => getDetailedStatusStyle(workload.status), [workload.status]);

  const cardData: ResourceCardData = useMemo(() => ({
    name: workload.sourceName,
    status: normalizeStatus(workload.status),
    lastUpdateTime: workload.lastUpdate,
    metrics: [
      { label: 'Instances', value: workload.instances.available },
      { label: 'Containers', value: workload.containers },
      { label: 'Attached Bridges', value: workload.bridges || 0 },
    ],
    tags: [
      { label: workload.sourceType, color: DEFAULT_COLORS.SUCCESS },
      { label: workload.grouper, icon: <AppstoreOutlined />, color: '#1890ff' },
    ],
    icon: <DeploymentUnitOutlined />,
  }), [workload]);

  const cardActions: ResourceCardActions = useMemo(() => ({
    onView: () => {
      if (onClick) {
        onClick();
      } else {
        navigate(`/workloads/${workload.name}/details`);
      }
    },
    onSync: async () => {
      message.info('Sync functionality not implemented yet');
    },
    onDelete: () => {
      message.warning('Delete functionality not implemented yet');
    },
  }), [navigate, workload.name, onClick, message]);

  const cardConfig: ResourceCardConfig = useMemo(() => ({
    title: 'Delete Workload',
    deleteTitle: 'Delete Workload',
    deleteMessage: 'Are you sure you want to delete this workload? This action cannot be undone.',
    syncText: 'Sync Workload',
    deleteText: 'Delete Workload',
    viewText: 'View Details',
  }), []);

  return (
    <ResourceCard
      data={cardData}
      actions={cardActions}
      config={cardConfig}
      customStatusStyle={statusStyle}
    />
  );
};

export default React.memo(WorkloadCard);
