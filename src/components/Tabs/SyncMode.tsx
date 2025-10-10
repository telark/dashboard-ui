import React from 'react';
import { Switch } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import PrimaryButton from '../buttons/PrimaryButton';
import { DEFAULT_COLORS } from '../../constants';
import { SYNC_MODE } from '../../constants/modes';

interface SyncModeProps {
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (checked: boolean) => void;
  handleSyncSave: () => void;
}

const SyncMode: React.FC<SyncModeProps> = ({
  isAutoSync,
  loadingSave,
  hasChanges,
  handleAutoSyncChange,
  handleSyncSave,
}) => {
  return (
    <div style={{ padding: '8px 4px' }}>
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
          style={{
            marginLeft: 8,
            backgroundColor: isAutoSync ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
          }}
        />
      </div>

      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
        <PrimaryButton
          onClick={handleSyncSave}
          disabled={!hasChanges}
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
