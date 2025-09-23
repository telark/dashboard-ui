import React from 'react';
import { Switch } from 'antd';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import PrimaryButton from '../buttons/PrimaryButton';
import { DEFAULT_COLORS } from '../../constants';
import { SYNC_MODE } from '../../constants/modes';

interface SyncModeProps {
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (checked: boolean) => void;
  handleGrouperSyncSave: () => void;
}

const SyncMode: React.FC<SyncModeProps> = ({
  isAutoSync,
  loadingSave,
  hasChanges,
  handleAutoSyncChange,
  handleGrouperSyncSave,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
      <div
        style={{
          padding: '32px',
          background: '#fff',
          border: '1px solid #e1e4e8',
          borderRadius: '10px',
          maxWidth: '900px',
          width: '100%',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div
            style={{
              flexShrink: 0,
              marginRight: '16px',
              marginTop: '4px',
              background: '#f0f9ff',
              borderRadius: '6px',
              padding: '10px',
            }}
          >
            <SyncOutlined style={{ fontSize: '22px', color: '#1890ff' }} />
          </div>

          <div style={{ flexGrow: 1 }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{SYNC_MODE.title}</h2>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
              {SYNC_MODE.description}
            </p>

            <ul style={{ marginTop: '14px', paddingLeft: '20px', color: '#444', fontSize: '14px' }}>
              {SYNC_MODE.list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, marginRight: '8px' }}>
            {SYNC_MODE.autoSyncLabel}
          </span>
          <Switch
            checked={isAutoSync}
            onChange={handleAutoSyncChange}
            checkedChildren={SYNC_MODE.autoSyncTextOn}
            unCheckedChildren={SYNC_MODE.autoSyncTextOff}
            style={{
              marginLeft: '8px',
              backgroundColor: isAutoSync ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
            }}
          />
        </div>

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton
            onClick={handleGrouperSyncSave}
            disabled={!hasChanges}
            loading={loadingSave}
            loadingLabel="Saving..."
            action={`${SYNC_MODE.saveButtonLabel} ${
              hasChanges ? `(${isAutoSync ? 'Auto Sync' : 'Manual Mode'})` : ''
            }`}
            icon={<CheckCircleOutlined />}
          />
        </div>
      </div>
    </div>
  );
};

export default SyncMode;
