import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Modal, Popover, App as AntdApp } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SyncOutlined,
  DeleteOutlined,
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
  GROUPER_CARD_TEXTS,
  CARD_STATES,
  CARD_DEFAULTS,
} from '../../constants';
import { UI } from '../../constants/ui';
import { GrouperInterface } from '../../interfaces/grouper';
import { CapitalizeFirstLetter } from '../../utils/helpers';
import { triggerSingleGrouperSync } from '../../clients/sync-manager';
import FancySpinner from '../common/FancySpinner';
import { SYNC_MESSAGES } from '../../constants/modes';
import store, { AppDispatch, RootState } from '../../store';
import { fetchAllGroupersThunk } from '../../store/slices/grouperSlice';
import { startSync, endSync } from '../../store/slices/grouperSlice';
import { useSelector } from 'react-redux';

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
      () =>
        status === CARD_STATES.STATUS.ACTIVE
          ? {
              color: DEFAULT_COLORS.SUCCESS,
              borderColor: DEFAULT_COLORS.SUCCESS,
              icon: <CheckCircleOutlined />,
            }
          : {
              color: DEFAULT_COLORS.DEFAULT,
              borderColor: DEFAULT_COLORS.DEFAULT,
              icon: <CloseCircleOutlined />,
            },
      [status],
    );

    const handleSync = useCallback(async () => {
      try {
        setSyncing(true);
        const apiName = syncName || name;
        (store.dispatch as AppDispatch)(startSync(name));
        const key = `sync-${apiName}`;
        message.open({
          type: 'loading',
          content: `${SYNC_MESSAGES.loading} ${apiName}…`,
          key,
          duration: 0,
        });
        const res = await triggerSingleGrouperSync(apiName);
        const effect = res?.data?.syncEffect ?? 'NoUpdate';

        // If the item should disappear, keep loading toast and poll until state updates
        if (effect === 'Deleted' || effect === 'NotFound') {
          // Kick a refresh immediately
          (store.dispatch as AppDispatch)(fetchAllGroupersThunk());
          // Poll local state briefly until this card is gone, then show success
          const start = Date.now();
          const waitMs = 4000;
          const interval = setInterval(() => {
            const state: RootState = store.getState();
            const stillThere = state.grouper.groupers.some((g: any) => g.name === name);
            if (!stillThere || Date.now() - start > waitMs) {
              clearInterval(interval);
              const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
              message.open({ type: 'success', content: friendly, key, duration: 2 });
            }
          }, 250);
        } else {
          const friendly = SYNC_MESSAGES.byEffect[effect] || SYNC_MESSAGES.completed;
          message.open({ type: 'success', content: friendly, key, duration: 2 });
        }
      } catch (err: any) {
        const meta = err?.normalized as { isTimeout?: boolean } | undefined;
        const phase = err?.response?.data?.data?.phase as string | undefined;
        const effect = err?.response?.data?.data?.syncEffect as string | undefined;
        const friendlyTimeout = GROUPER_CARD_TEXTS.SYNC.TIMEOUT_MESSAGE;
        const friendly = meta?.isTimeout
          ? friendlyTimeout
          : (phase && SYNC_MESSAGES.byPhase[phase]) ||
            (effect && SYNC_MESSAGES.byEffect[effect!]) ||
            SYNC_MESSAGES.byPhase.Failed;
        message.open({ type: 'error', content: friendly, key: 'sync-error', duration: 3 });
      } finally {
        setSyncing(false);
        (store.dispatch as AppDispatch)(endSync(name));
      }
    }, [name, syncName, message]);
    const handleView = useCallback(() => navigate(`/groupers/${name}/details`), [navigate, name]);
    const handleDelete = useCallback(() => setModalVisible(true), []);
    const handleConfirmDelete = useCallback(() => {
      setModalVisible(false);
      message.warning(GROUPER_CARD_TEXTS.SYNC.SUCCESS_DELETE);
    }, [message]);
    const handleCancelDelete = useCallback(() => setModalVisible(false), []);

    return (
      <>
        <Modal
          title={UI.CARD.DELETE_TITLE}
          open={isModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText={UI.BUTTONS.CONFIRM}
          cancelText={UI.BUTTONS.CANCEL}
          okButtonProps={{ danger: true }}
        >
          {UI.CARD.DELETE_MESSAGE}
        </Modal>

        <Card
          style={{
            width: '100%',
            borderRadius: CARD_CONFIGS.GROUPER_CARD.BORDER_RADIUS,
            boxShadow: CARD_COLORS.SHADOW.CARD,
            border: 'none',
            position: 'relative',
            background: CARD_COLORS.BACKGROUND.DEFAULT,
            transition: CARD_TRANSITIONS.CARD,
          }}
          styles={{ body: { padding: CARD_CONFIGS.GROUPER_CARD.BODY_PADDING } }}
          hoverable
          actions={[
            <Popover key="view-pop" content={UI.CARD.POPOVER.VIEW} trigger="hover">
              <EyeOutlined
                key="view"
                style={{
                  fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
                  cursor: 'pointer',
                  transition: CARD_TRANSITIONS.ICON,
                }}
                onClick={handleView}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.color = statusStyle.color as string;
                  (e.currentTarget as HTMLElement).style.transform = CARD_EFFECTS.ICON_SCALE;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '';
                  (e.currentTarget as HTMLElement).style.transform = CARD_EFFECTS.ICON_SCALE_NORMAL;
                }}
              />
            </Popover>,
            <Popover key="sync-pop" content={UI.CARD.POPOVER.SYNC} trigger="hover">
              <span
                onClick={isSyncingEffective ? undefined : handleSync}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: CARD_CONFIGS.GROUPER_CARD.ICON_SIZE,
                  height: CARD_CONFIGS.GROUPER_CARD.ICON_SIZE,
                  cursor: isSyncingEffective ? 'default' : 'pointer',
                }}
              >
                {isSyncingEffective ? (
                  <FancySpinner
                    showLabel={false}
                    size={22}
                    ringThickness={2}
                    icon={<SyncOutlined />}
                    orbit={false}
                  />
                ) : (
                  <SyncOutlined
                    key="sync"
                    style={{
                      fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
                      transition: CARD_TRANSITIONS.ICON,
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.color = statusStyle.color as string;
                      (e.currentTarget as HTMLElement).style.transform = CARD_EFFECTS.ICON_SCALE;
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '';
                      (e.currentTarget as HTMLElement).style.transform =
                        CARD_EFFECTS.ICON_SCALE_NORMAL;
                    }}
                  />
                )}
              </span>
            </Popover>,
            <Popover key="delete-pop" content={UI.CARD.POPOVER.DELETE} trigger="hover">
              <DeleteOutlined
                key="delete"
                style={{
                  fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
                  cursor: 'pointer',
                  color: DEFAULT_COLORS.DANGER,
                  transition: CARD_TRANSITIONS.ICON,
                }}
                onClick={handleDelete}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.color = statusStyle.color as string;
                  (e.currentTarget as HTMLElement).style.transform = CARD_EFFECTS.ICON_SCALE;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.color = DEFAULT_COLORS.DANGER as string;
                  (e.currentTarget as HTMLElement).style.transform = CARD_EFFECTS.ICON_SCALE_NORMAL;
                }}
              />
            </Popover>,
          ]}
        >
          {/* Top-right icons */}
          <div
            style={{
              position: 'absolute',
              top: CARD_CONFIGS.GROUPER_CARD.POSITION.TOP,
              right: CARD_CONFIGS.GROUPER_CARD.POSITION.RIGHT,
              display: 'flex',
              alignItems: 'center',
              gap: CARD_CONFIGS.GROUPER_CARD.TOP_ICONS_GAP,
              zIndex: 2,
            }}
          >
            <StatusButton status={status} icon={statusStyle.icon} />
            {maintenance?.status === CARD_STATES.MAINTENANCE.ACTIVE && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.GAP,
                  backgroundColor: CARD_COLORS.BACKGROUND.MAINTENANCE_BADGE,
                  color: CARD_COLORS.TEXT.MAINTENANCE,
                  padding: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.PADDING,
                  borderRadius: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.BORDER_RADIUS,
                  fontSize: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.FONT_SIZE,
                  fontWeight: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.FONT_WEIGHT,
                }}
              >
                <WarningOutlined
                  style={{ fontSize: CARD_CONFIGS.GROUPER_CARD.MAINTENANCE_BADGE.ICON_FONT_SIZE }}
                />
                {UI.CARD.MAINTENANCE_BADGE}
              </div>
            )}
            <Popover content={UI.CARD.INFO_POPOVER} trigger="hover">
              <InfoCircleOutlined
                style={{
                  fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
                  color: CARD_COLORS.TEXT.INFO,
                  cursor: 'pointer',
                }}
              />
            </Popover>
          </div>

          {/* Card Main Content */}
          <div style={{ marginTop: '4px' }}>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: CARD_CONFIGS.GROUPER_CARD.HEADER_GAP,
                marginBottom: CARD_CONFIGS.GROUPER_CARD.HEADER_MARGIN_BOTTOM,
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
                  style={{
                    display: 'inline-flex',
                    fontSize: '18px',
                    color: DEFAULT_COLORS.SUCCESS,
                  }}
                >
                  <AppstoreOutlined />
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
                  {CapitalizeFirstLetter(name)}
                </Title>
                <Text
                  style={{
                    color: DEFAULT_COLORS.DEFAULT,
                    fontSize: CARD_CONFIGS.GROUPER_CARD.DESCRIPTION_FONT_SIZE,
                  }}
                >
                  {UI.CARD.LAST_UPDATE_PREFIX} <TimeAgo date={lastUpdateTime} />
                </Text>
              </div>
            </div>

            {/* Metrics */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: CARD_CONFIGS.GROUPER_CARD.METRICS_PADDING_TOP,
                gap: CARD_CONFIGS.GROUPER_CARD.METRICS_GAP,
              }}
            >
              <Metric label={UI.CARD.METRICS.WORKLOADS} value={numberOfWorkloads} />
              <Metric label={UI.CARD.METRICS.BRIDGES} value={numberOfBridges} />
            </div>
          </div>
        </Card>
      </>
    );
  },
);

export default GrouperCard;
