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
  CARD_CONFIGS,
  CARD_COLORS,
  CARD_TRANSITIONS,
} from '../../../constants';
import { GrouperInterface } from '../../../interfaces/grouper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getStatusStyle } from '../../../utils/helpers';
import { syncGrouper } from '../../../utils/sync';
import { GrouperCardModal } from './index';
import GrouperCardContent from './GrouperCardContent';


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
          style={{
            width: '100%',
            borderRadius: CARD_CONFIGS.GROUPER_CARD.BORDER_RADIUS,
            boxShadow: CARD_COLORS.SHADOW.CARD,
            border: 'none',
            position: 'relative',
            background: CARD_COLORS.BACKGROUND.DEFAULT,
            transition: CARD_TRANSITIONS.CARD,
            marginBottom: '16px',
            cursor: 'pointer',
          }}
          styles={{ body: { padding: CARD_CONFIGS.GROUPER_CARD.BODY_PADDING } }}
          hoverable
          onClick={handleView}
        >
          <GrouperCardContent
            name={name}
            lastUpdateTime={lastUpdateTime}
            numberOfWorkloads={numberOfWorkloads}
            numberOfBridges={numberOfBridges}
            status={status}
            maintenance={maintenance}
            statusStyle={statusStyle}
            isSyncingEffective={isSyncingEffective}
            onView={handleView}
            onSync={handleSync}
            onDelete={handleDelete}
          />
        </Card>
      </>
    );
  },
);

export default GrouperCard;
