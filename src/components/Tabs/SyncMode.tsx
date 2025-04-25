import React from 'react';
import { Switch } from 'antd';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import PrimaryButton from '../Buttons/PrimaryButton';
import { DEFAULT_COLORS } from '../../constants';

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
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Configure Sync Mode</h2>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
              Manage the synchronization behavior of your resources within this namespace. When
              enabled, Auto Sync ensures that your system periodically fetches the latest updates,
              keeping everything in sync automatically. In Manual Mode, updates are only applied
              when you explicitly trigger them, giving you more control over when changes are made.
            </p>

            <ul style={{ marginTop: '14px', paddingLeft: '20px', color: '#444', fontSize: '14px' }}>
              <li>
                <strong>Auto Sync</strong> will periodically fetch updates and automatically
                reconcile the state of your resources.
              </li>
              <li>
                <strong>Manual Mode</strong> provides more control by requiring manual intervention
                to synchronize resources.
              </li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, marginRight: '8px' }}>
            Auto Sync Mode:
          </span>
          <Switch
            checked={isAutoSync}
            onChange={handleAutoSyncChange}
            checkedChildren="On"
            unCheckedChildren="Off"
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
            action={`Save Settings ${
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
