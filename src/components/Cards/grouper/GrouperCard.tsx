import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, App as AntdApp, Typography, Dropdown } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
  EyeOutlined,
  SyncOutlined,
  DeleteOutlined,
  MoreOutlined,
  ToolOutlined,
} from '@ant-design/icons';

import {
  GROUPER_CARD_TEXTS,
  CARD_STATES,
  CARD_DEFAULTS,
  DEFAULT_COLORS,
  CARD_CONFIGS,
  CARD_COLORS,
  CARD_TRANSITIONS,
} from '../../../constants';
import { GrouperInterface } from '../../../interfaces/grouper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getStatusStyle } from '../../../constants/cards/grouper';
import { syncGrouper } from '../../../utils/sync';
import StatusButton from '../../buttons/StatusButton';
import TimeAgo from '../../time/TimeAgo';
import { Metric } from '../../shared';
import { StatusTag } from '../../tags';
import { UI } from '../../../constants/ui';
import { CapitalizeFirstLetter } from '../../../utils/helpers';
import { GrouperCardModal } from './index';

const { Title, Text } = Typography;

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

    const menuItems = [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: (e: any) => {
          e.domEvent?.stopPropagation();
          handleView();
        },
      },
      {
        key: 'sync',
        icon: isSyncingEffective ? <SyncOutlined spin /> : <SyncOutlined />,
        label: isSyncingEffective ? 'Syncing...' : 'Sync Grouper',
        onClick: isSyncingEffective ? undefined : (e: any) => {
          e.domEvent?.stopPropagation();
          handleSync();
        },
        disabled: isSyncingEffective,
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete Grouper',
        onClick: (e: any) => {
          e.domEvent?.stopPropagation();
          handleDelete();
        },
        danger: true,
      },
    ];

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
          {/* Single Row Layout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Left side - Icon + Name + Maintenance */}
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
                  <AppstoreOutlined />
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Title
                  level={5}
                  style={{
                    margin: 0,
                    fontSize: CARD_CONFIGS.GROUPER_CARD.TITLE_FONT_SIZE,
                    fontWeight: '600',
                  }}
                >
                  {CapitalizeFirstLetter(name)}
                </Title>
                <Text
                  style={{
                    color: DEFAULT_COLORS.DEFAULT,
                    fontSize: CARD_CONFIGS.GROUPER_CARD.DESCRIPTION_FONT_SIZE,
                    marginTop: '-2px',
                    display: 'block',
                  }}
                >
                  {UI.CARD.LAST_UPDATE_PREFIX} <TimeAgo date={lastUpdateTime} />
                </Text>
              </div>
            </div>

            {/* Right side - Metrics + Maintenance + Status + Dropdown */}
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
                <Metric label={UI.CARD.METRICS.WORKLOADS} value={numberOfWorkloads} />
                <Metric label={UI.CARD.METRICS.BRIDGES} value={numberOfBridges} />
              </div>

              {/* Maintenance Badge */}
              {maintenance?.status === CARD_STATES.MAINTENANCE.ACTIVE && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '0 8px',
                    borderRadius: '18px',
                    border: '1px solid #f59e0b',
                    height: '26px',
                  }}
                >
                  <ToolOutlined
                    style={{
                      fontSize: '12px',
                      color: '#f59e0b',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: '11px',
                      color: '#f59e0b',
                      fontWeight: '500',
                      lineHeight: 1,
                    }}
                  >
                    Maintenance
                  </Text>
                </div>
              )}

              {/* Status */}
              <StatusButton
                status={status === CARD_STATES.STATUS.ACTIVE ? 'Active' : 'Inactive'}
                icon={statusStyle.icon}
              />

              {/* Dropdown */}
              <div onClick={(e) => e.stopPropagation()}>
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
                    onClick={(e) => {
                      e.stopPropagation();
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
          </div>
        </Card>
      </>
    );
  },
);

export default GrouperCard;
