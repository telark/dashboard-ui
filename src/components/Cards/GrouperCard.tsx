import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Modal, Popover, Spin, App as AntdApp } from 'antd';
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
import { DEFAULT_COLORS } from '../../constants';
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

const GrouperCard: React.FC<GrouperInterface> = ({
  name = 'Unknown',
  maintenance = null,
  status = 'Inactive',
  numberOfWorkloads = 0,
  numberOfBridges = 0,
  lastUpdateTime = '',
  syncName,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const globalSyncing = useSelector((s: RootState) => (s.grouper as any).syncing || {});
  const isGloballySyncing = Boolean(globalSyncing[name]);
  const isSyncingEffective = syncing || isGloballySyncing;

  const statusStyle =
    status === 'Active'
      ? {
          color: DEFAULT_COLORS.SUCCESS,
          borderColor: DEFAULT_COLORS.SUCCESS,
          icon: <CheckCircleOutlined />,
        }
      : {
          color: DEFAULT_COLORS.DEFAULT,
          borderColor: DEFAULT_COLORS.DEFAULT,
          icon: <CloseCircleOutlined />,
        };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const apiName = syncName || name;
      (store.dispatch as AppDispatch)(startSync(name));
      console.log('Triggering SyncGrouper for:', apiName);
      const key = `sync-${apiName}`;
      message.open({ type: 'loading', content: `${SYNC_MESSAGES.loading} ${apiName}…`, key, duration: 0 });
      const res = await triggerSingleGrouperSync(apiName);
      const phase = res?.data?.phase ?? 'Completed';
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
      const friendlyTimeout = 'Taking a bit longer than usual. Please try again in a moment.';
      const friendly = meta?.isTimeout
        ? friendlyTimeout
        : (phase && SYNC_MESSAGES.byPhase[phase]) || (effect && SYNC_MESSAGES.byEffect[effect!]) || SYNC_MESSAGES.byPhase.Failed;
      message.open({ type: 'error', content: friendly, key: 'sync-error', duration: 3 });
    } finally {
      setSyncing(false);
      (store.dispatch as AppDispatch)(endSync(name));
    }
  };
  const handleView = () => navigate(`/groupers/${name}/details`);
  const handleDelete = () => setModalVisible(true);
  const handleConfirmDelete = () => {
    setModalVisible(false);
    message.warning('Grouper deleted successfully.');
  };
  const handleCancelDelete = () => setModalVisible(false);

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
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
          border: 'none',
          position: 'relative',
          background: '#fff',
          transition: 'transform 0.2s ease-in-out',
        }}
        styles={{ body: { padding: '22px 24px 6px' } }}
        hoverable
        actions={[
          <Popover key="view-pop" content={UI.CARD.POPOVER.VIEW} trigger="hover">
            <EyeOutlined
              key="view"
              style={{ fontSize: '16px', cursor: 'pointer', transition: 'color 0.3s, transform 0.3s' }}
              onClick={handleView}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.color = statusStyle.color as string;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.color = '';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            />
          </Popover>,
          <Popover key="sync-pop" content={UI.CARD.POPOVER.SYNC} trigger="hover">
            <span
              onClick={isSyncingEffective ? undefined : handleSync}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, cursor: isSyncingEffective ? 'default' : 'pointer' }}
            >
              {isSyncingEffective ? (
                <FancySpinner showLabel={false} size={22} ringThickness={2} icon={<SyncOutlined />} orbit={false} />
              ) : (
                <SyncOutlined
                  key="sync"
                  style={{ fontSize: '16px', transition: 'color 0.3s, transform 0.3s' }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.color = statusStyle.color as string;
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                />
              )}
            </span>
          </Popover>,
          <Popover key="delete-pop" content={UI.CARD.POPOVER.DELETE} trigger="hover">
            <DeleteOutlined
              key="delete"
              style={{ fontSize: '16px', cursor: 'pointer', color: DEFAULT_COLORS.DANGER, transition: 'color 0.3s, transform 0.3s' }}
              onClick={handleDelete}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.color = statusStyle.color as string;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.color = DEFAULT_COLORS.DANGER as string;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            />
          </Popover>,
        ]}
      >
        {/* Top-right icons */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 2,
          }}
        >
          <StatusButton status={status} icon={statusStyle.icon} />
          {maintenance?.status === 'Active' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fef4e5',
                color: '#faad14',
                padding: '4px 10px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              <WarningOutlined style={{ fontSize: '16px' }} />
              {UI.CARD.MAINTENANCE_BADGE}
            </div>
          )}
          <Popover content={UI.CARD.INFO_POPOVER} trigger="hover">
            <InfoCircleOutlined style={{ fontSize: '16px', color: '#888', cursor: 'pointer' }} />
          </Popover>
        </div>

        {/* Card Main Content */}
        <div style={{ marginTop: '4px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                backgroundColor: 'rgba(32, 201, 151, 0.12)',
                padding: '10px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
              }}
            >
              <span style={{ display: 'inline-flex', fontSize: '18px', color: DEFAULT_COLORS.SUCCESS }}>
                <AppstoreOutlined />
              </span>
            </div>
            <div>
              <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                {CapitalizeFirstLetter(name)}
              </Title>
              <Text style={{ color: DEFAULT_COLORS.DEFAULT, fontSize: '12px' }}>
                {UI.CARD.LAST_UPDATE_PREFIX} <TimeAgo date={lastUpdateTime} />
              </Text>
            </div>
          </div>

          {/* Metrics */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
              gap: '20px',
            }}
          >
            <Metric label={UI.CARD.METRICS.WORKLOADS} value={numberOfWorkloads} />
            <Metric label={UI.CARD.METRICS.BRIDGES} value={numberOfBridges} />
          </div>
        </div>
      </Card>
    </>
  );
};

export default GrouperCard;
