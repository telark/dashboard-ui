import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

import { GROUPER_CARD_TEXTS, CARD_DEFAULTS } from '../../../constants';
import { GrouperInterface } from '../../../interfaces/grouper';
import { RootState } from '../../../store';
import { syncGrouper } from '../../../utils/grouper/sync';
import { getDetailedStatusStyle, normalizeStatus } from '../../../utils/helpers/status';
import { ResourceCard, ResourceCardData, ResourceCardActions, ResourceCardConfig } from '../shared';

const GrouperCard: React.FC<GrouperInterface> = React.memo(function GrouperCard({
  name = CARD_DEFAULTS.GROUPER.NAME,
  maintenance = null,
  status = CARD_DEFAULTS.GROUPER.STATUS,
  numberOfWorkloads = CARD_DEFAULTS.GROUPER.WORKLOADS,
  numberOfBridges = CARD_DEFAULTS.GROUPER.BRIDGES,
  lastUpdateTime = CARD_DEFAULTS.GROUPER.LAST_UPDATE,
  syncName,
}) {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const cardData: ResourceCardData = useMemo(
    () => ({
      name,
      status: normalizeStatus(status),
      lastUpdateTime,
      maintenance,
      metrics: [
        { label: 'Workloads', value: numberOfWorkloads },
        { label: 'Bridges', value: numberOfBridges },
      ],
      icon: <AppstoreOutlined />,
      syncName,
    }),
    [name, status, lastUpdateTime, maintenance, numberOfWorkloads, numberOfBridges, syncName],
  );

  const customStatusStyle = useMemo(() => getDetailedStatusStyle(status), [status]);

  const cardActions: ResourceCardActions = useMemo(
    () => ({
      onView: () => navigate(`/groupers/${name}/details`),
      onSync: async () => {
        await syncGrouper({
          name,
          syncName,
          message,
          setSyncing: () => {}, // This will be handled by the ResourceCard
        });
      },
      onDelete: () => {
        message.warning(GROUPER_CARD_TEXTS.SYNC.SUCCESS_DELETE);
      },
    }),
    [navigate, name, syncName, message],
  );

  const cardConfig: ResourceCardConfig = useMemo(
    () => ({
      title: GROUPER_CARD_TEXTS.DELETE.TITLE,
      deleteTitle: GROUPER_CARD_TEXTS.DELETE.TITLE,
      deleteMessage: GROUPER_CARD_TEXTS.DELETE.MESSAGE,
      syncText: GROUPER_CARD_TEXTS.POPOVER.SYNC,
      deleteText: GROUPER_CARD_TEXTS.POPOVER.DELETE,
      viewText: GROUPER_CARD_TEXTS.POPOVER.VIEW,
    }),
    [],
  );

  const globalSyncingSelector = useCallback((state: RootState) => state.grouper.syncing || {}, []);

  return (
    <ResourceCard
      data={cardData}
      actions={cardActions}
      config={cardConfig}
      globalSyncingSelector={globalSyncingSelector}
      syncFunction={syncGrouper}
      customStatusStyle={customStatusStyle}
    />
  );
});

export default GrouperCard;
