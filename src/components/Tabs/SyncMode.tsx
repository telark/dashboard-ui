import React from 'react';
import { Switch } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import PrimaryButton from '../buttons/PrimaryButton';
import { DEFAULT_COLORS } from '../../constants';
import { SYNC_MODE } from '../../constants/modes';
import FancySpinner from '../shared/FancySpinner';

interface SyncModeProps {
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (checked: boolean) => void;
  handleSyncSave: () => void;
  syncing?: boolean;
  isGloballySyncing?: boolean;
}

const SyncMode: React.FC<SyncModeProps> = ({
  isAutoSync,
  loadingSave,
  hasChanges,
  handleAutoSyncChange,
  handleSyncSave,
  syncing = false,
  isGloballySyncing = false,
}) => {
  const isSyncInProgress = syncing || isGloballySyncing;
  return (
    <div style={{ padding: '8px 4px' }}>
      {/* Sync in progress banner */}
      {isSyncInProgress && (
        <div
          style={{
            background: '#f6f8fa',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            border: '1px solid #d0d7de',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'syncBannerFadeIn 0.3s ease-out',
          }}
        >
          <FancySpinner
            size={18}
            color={DEFAULT_COLORS.SUCCESS}
            showLabel={false}
            ringThickness={2}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                color: '#24292f',
                fontWeight: 500,
                fontSize: 14,
                marginBottom: 2,
              }}
            >
              Syncing in Progress
            </div>
            <div
              style={{
                color: '#656d76',
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              Settings are temporarily locked until sync completes
            </div>
          </div>

          <style>{`
            @keyframes syncBannerFadeIn {
              0% { 
                opacity: 0; 
                transform: translateY(-8px); 
              }
              100% { 
                opacity: 1; 
                transform: translateY(0); 
              }
            }
          `}</style>
        </div>
      )}

      {/* Description only (title & icon are handled by the section header) */}
      <p style={{ marginTop: 0, fontSize: '13px', color: '#5B6B7C', lineHeight: 1.6 }}>
        {SYNC_MODE.description}
      </p>
      <ul style={{ marginTop: '10px', paddingLeft: '18px', color: '#4a5568', fontSize: '13px' }}>
        {SYNC_MODE.list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
        <span style={{ fontSize: '14px', fontWeight: 600, marginRight: 8 }}>
          {SYNC_MODE.autoSyncLabel}
        </span>
        <Switch
          checked={isAutoSync}
          onChange={handleAutoSyncChange}
          checkedChildren={SYNC_MODE.autoSyncTextOn}
          unCheckedChildren={SYNC_MODE.autoSyncTextOff}
          disabled={isSyncInProgress}
          style={{
            marginLeft: 8,
            backgroundColor: isAutoSync ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
          }}
        />
      </div>

      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
        <PrimaryButton
          onClick={handleSyncSave}
          disabled={!hasChanges || isSyncInProgress}
          loading={loadingSave}
          loadingLabel="Saving..."
          action={`${SYNC_MODE.saveButtonLabel} ${hasChanges ? `(${isAutoSync ? 'Auto Sync' : 'Manual Mode'})` : ''}`}
          icon={<CheckCircleOutlined />}
        />
      </div>
    </div>
  );
};

export default SyncMode;
