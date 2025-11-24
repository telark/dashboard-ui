import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { AiOutlineCluster, AiOutlineApi } from 'react-icons/ai';

import { BRIDGE_CARD_TEXTS, CARD_DEFAULTS, DEFAULT_COLORS } from '../../../../../constants';
import type { BridgeInterface } from '../../models';
import { RootState } from '../../../../../store';
import { syncBridge } from '../../utils/management/sync';
import { getDetailedStatusStyle, normalizeStatus } from '../../../../../utils/helpers/status';
import {
  ResourceCard,
  ResourceCardData,
  ResourceCardActions,
  ResourceCardConfig,
} from '../../../../../components/cards/shared';

const BridgeCard: React.FC<BridgeInterface> = React.memo(function BridgeCard({
  name = CARD_DEFAULTS.BRIDGE.NAME,
  status = CARD_DEFAULTS.BRIDGE.STATUS,
  ports = [],
  workloads = [],
  lastUpdateTime = CARD_DEFAULTS.BRIDGE.LAST_UPDATE,
  syncName,
  type,
  grouper,
}) {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const numberOfPorts = ports?.length || 0;
  const numberOfWorkloadsValue = workloads?.length || 0;

  const cardData: ResourceCardData = useMemo(
    () => ({
      name,
      sourceName: name,
      status: normalizeStatus(status),
      lastUpdateTime,
      metrics: [
        { label: 'Workloads', value: numberOfWorkloadsValue },
        { label: 'Ports', value: numberOfPorts },
      ],
      icon: <AiOutlineApi />,
      syncName,
      tags: [
        { label: type, color: DEFAULT_COLORS.SUCCESS },
        { label: grouper, icon: <AiOutlineCluster />, color: '#1890ff' },
      ],
    }),
    [name, status, lastUpdateTime, numberOfWorkloadsValue, numberOfPorts, syncName, type, grouper],
  );

  const customStatusStyle = useMemo(() => getDetailedStatusStyle(status), [status]);

  const cardActions: ResourceCardActions = useMemo(
    () => ({
      onView: () => navigate(`/bridges/${name}/details`),
      onSync: async () => {
        await syncBridge({
          name,
          syncName,
          message,
          setSyncing: () => {}, // This will be handled by the ResourceCard
        });
      },
      onDelete: () => {
        message.warning(BRIDGE_CARD_TEXTS.SYNC.SUCCESS_DELETE);
      },
    }),
    [navigate, name, syncName, message],
  );

  const cardConfig: ResourceCardConfig = useMemo(
    () => ({
      title: BRIDGE_CARD_TEXTS.DELETE.TITLE,
      deleteTitle: BRIDGE_CARD_TEXTS.DELETE.TITLE,
      deleteMessage: BRIDGE_CARD_TEXTS.DELETE.MESSAGE,
      syncText: BRIDGE_CARD_TEXTS.POPOVER.SYNC,
      deleteText: BRIDGE_CARD_TEXTS.POPOVER.DELETE,
      viewText: BRIDGE_CARD_TEXTS.POPOVER.VIEW,
    }),
    [],
  );

  const globalSyncingSelector = useCallback((state: RootState) => state.bridge.syncing || {}, []);

  return (
    <ResourceCard
      data={cardData}
      actions={cardActions}
      config={cardConfig}
      globalSyncingSelector={globalSyncingSelector}
      syncFunction={syncBridge}
      customStatusStyle={customStatusStyle}
    />
  );
});

export default BridgeCard;
