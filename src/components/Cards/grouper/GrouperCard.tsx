import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, App as AntdApp } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

import {
  GROUPER_CARD_TEXTS,
  CARD_STATES,
  CARD_DEFAULTS,
} from '../../../constants';
import { GrouperInterface } from '../../../interfaces/grouper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { GROUPER_CARD_STYLES, getStatusStyle } from '../../../constants/cards/grouper';
import { syncGrouper } from '../../../utils/sync';
import {
  GrouperCardHeader,
  GrouperCardTopIcons,
  GrouperCardMetrics,
  createGrouperCardActions,
  GrouperCardModal,
} from './index';

const GrouperCard: React.FC<GrouperInterface> = React.memo(
  ({
    name = CARD_DEFAULTS.GROUPER.NAME,
    maintenance = null,
    status = CARD_DEFAULTS.GROUPER.STATUS,
    numberOfWorkloads = CARD_DEFAULTS.GROUPER.WORKLOADS,
    numberOfBridges = CARD_DEFAULTS.GROUPER.BRIDGES,
    lastUpdateTime = CARD_DEFAULTS.GROUPER.LAST_UPDATE,
    syncName,
  }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();
    const globalSyncing = useSelector((s: RootState) => (s.grouper as any).syncing || {});
    const isGloballySyncing = Boolean(globalSyncing[name]);
    const isSyncingEffective = syncing || isGloballySyncing;

    const statusStyle = useMemo(
      () => ({
        ...getStatusStyle(status),
        icon: status === CARD_STATES.STATUS.ACTIVE ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
      }),
      [status],
    ) as {
      color: string;
      borderColor: string;
      icon: React.ReactElement;
    };

    const handleSync = useCallback(async () => {
      await syncGrouper({
        name,
        syncName,
        message,
        setSyncing,
      });
    }, [name, syncName, message, setSyncing]);
    const handleView = useCallback(() => navigate(`/groupers/${name}/details`), [navigate, name]);
    const handleDelete = useCallback(() => setModalVisible(true), []);
    const handleConfirmDelete = useCallback(() => {
      setModalVisible(false);
      message.warning(GROUPER_CARD_TEXTS.SYNC.SUCCESS_DELETE);
    }, [message]);
    const handleCancelDelete = useCallback(() => setModalVisible(false), []);

    return (
      <>
        <GrouperCardModal
          isVisible={isModalVisible}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        <Card
          style={GROUPER_CARD_STYLES.card}
          styles={{ body: GROUPER_CARD_STYLES.cardBody }}
          hoverable
          actions={createGrouperCardActions({
            isSyncingEffective,
            statusStyle,
            onView: handleView,
            onSync: handleSync,
            onDelete: handleDelete,
          })}
        >
          <GrouperCardTopIcons
            status={status}
            maintenance={maintenance}
            statusStyle={statusStyle}
          />

          <div style={GROUPER_CARD_STYLES.mainContent}>
            <GrouperCardHeader
              name={name}
              lastUpdateTime={lastUpdateTime}
            />

            <GrouperCardMetrics
              numberOfWorkloads={numberOfWorkloads}
              numberOfBridges={numberOfBridges}
            />
          </div>
        </Card>
      </>
    );
  },
);

export default GrouperCard;
