import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, App as AntdApp } from 'antd';

import {
  CARD_CONFIGS,
  CARD_COLORS,
  CARD_TRANSITIONS,
} from '../../../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getStatusStyle } from '../../../utils/helpers/format';
import { ResourceCardModal, ResourceCardContent } from '.';

export interface ResourceCardData {
  name: string;
  status: string;
  lastUpdateTime: string;
  maintenance?: { status: string } | null;
  metrics: Array<{
    label: string;
    value: number | string;
  }>;
  tags?: Array<{
    label: string;
    color: string;
    icon?: React.ReactElement;
  }>;
  icon: React.ReactElement;
  syncName?: string;
}

export interface ResourceCardActions {
  onView: () => void;
  onSync: () => void;
  onDelete: () => void;
}

export interface ResourceCardConfig {
  title: string;
  deleteTitle: string;
  deleteMessage: string;
  syncText: string;
  deleteText: string;
  viewText: string;
}

interface ResourceCardProps {
  data: ResourceCardData;
  actions: ResourceCardActions;
  config: ResourceCardConfig;
  isSyncing?: boolean;
  globalSyncingSelector?: (state: RootState) => Record<string, boolean>;
  syncFunction?: (params: {
    name: string;
    syncName?: string;
    message: any;
    setSyncing: (syncing: boolean) => void;
  }) => Promise<void>;
  customStatusStyle?: {
    color: string;
    borderColor: string;
    icon?: React.ReactElement;
  };
}

const ResourceCard: React.FC<ResourceCardProps> = React.memo(
  ({
    data,
    actions,
    config,
    isSyncing = false,
    globalSyncingSelector,
    syncFunction,
    customStatusStyle,
  }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();
    
    const globalSyncing = globalSyncingSelector 
      ? useSelector(globalSyncingSelector)
      : {};
    const isGloballySyncing = Boolean(globalSyncing[data.name]);
    const isSyncingEffective = syncing || isGloballySyncing || isSyncing;

    const statusStyle = useMemo(
      () => ({
        ...(customStatusStyle || getStatusStyle(data.status)),
      }),
      [data.status, customStatusStyle],
    ) as {
      color: string;
      borderColor: string;
      icon?: React.ReactElement;
    };

    const handleSync = useCallback(async () => {
      if (syncFunction) {
        await syncFunction({
          name: data.name,
          syncName: data.syncName,
          message,
          setSyncing,
        });
      }
    }, [data.name, data.syncName, message, syncFunction]);

    const handleView = useCallback(() => {
      actions.onView();
    }, [actions]);

    const handleDelete = useCallback(() => {
      setModalVisible(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      setModalVisible(false);
      actions.onDelete();
    }, [actions]);

    const handleCancelDelete = useCallback(() => {
      setModalVisible(false);
    }, []);

    return (
      <>
        <ResourceCardModal
          isVisible={isModalVisible}
          title={config.deleteTitle}
          message={config.deleteMessage}
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
          <ResourceCardContent
            data={data}
            statusStyle={statusStyle}
            isSyncingEffective={isSyncingEffective}
            actions={{
              onView: handleView,
              onSync: handleSync,
              onDelete: handleDelete,
            }}
            config={config}
          />
        </Card>
      </>
    );
  },
);

export default ResourceCard;
