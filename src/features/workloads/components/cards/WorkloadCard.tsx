import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { AiOutlineCluster, AiOutlineAppstore } from 'react-icons/ai';

import { DEFAULT_COLORS } from '../../../../constants';
import type { AppWorkloadCardData } from '../../models';
import { getDetailedStatusStyle, normalizeStatus } from '../../../../utils/helpers/status';
import { ResourceCard, ResourceCardData, ResourceCardActions, ResourceCardConfig } from '../../../../components/cards/shared';
import { syncAppWorkload } from '../../utils/sync/sync';
import { RootState } from '../../../../store';

interface WorkloadCardProps {
  workload: AppWorkloadCardData;
  onClick?: () => void;
}

const WorkloadCard: React.FC<WorkloadCardProps> = ({ workload, onClick }) => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const statusStyle = useMemo(() => getDetailedStatusStyle(workload.status), [workload.status]);

  const cardData: ResourceCardData = useMemo(
    () => ({
      name: workload.name,
      sourceName: workload.sourceName,
      status: normalizeStatus(workload.status),
      lastUpdateTime: workload.lastUpdate,
      metrics: [
        { label: 'Instances', value: workload.instances.available },
        { label: 'Containers', value: workload.containers },
        { label: 'Attached Bridges', value: workload.bridges || 0 },
      ],
      tags: [
        { label: workload.sourceType, color: DEFAULT_COLORS.SUCCESS },
        { label: workload.grouper, icon: <AiOutlineCluster />, color: '#1890ff' },
      ],
      icon: <AiOutlineAppstore />,
    }),
    [workload],
  );

  const cardActions: ResourceCardActions = useMemo(
    () => ({
      onView: () => {
        if (onClick) {
          onClick();
        } else {
          navigate(`/workloads/${workload.name}/details`);
        }
      },
      onSync: async () => {
        await syncAppWorkload({
          name: workload.name,
          message,
          setSyncing: () => {}, // This will be handled by the ResourceCard
        });
      },
      onDelete: () => {
        message.warning('Delete functionality not implemented yet');
      },
    }),
    [navigate, workload.name, onClick, message],
  );

  const cardConfig: ResourceCardConfig = useMemo(
    () => ({
      title: 'Delete Workload',
      deleteTitle: 'Delete Workload',
      deleteMessage: 'Are you sure you want to delete this workload? This action cannot be undone.',
      syncText: 'Sync Workload',
      deleteText: 'Delete Workload',
      viewText: 'View Details',
    }),
    [],
  );

  const globalSyncingSelector = useCallback((state: RootState) => state.workload.syncing || {}, []);

  return (
    <ResourceCard
      data={cardData}
      actions={cardActions}
      config={cardConfig}
      globalSyncingSelector={globalSyncingSelector}
      syncFunction={syncAppWorkload}
      customStatusStyle={statusStyle}
    />
  );
};

export default React.memo(WorkloadCard);
