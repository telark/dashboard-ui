import React from 'react';
import { EyeOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import { ResourcesActionBarProps } from '../../../../interfaces/grouper';

const ActionBar: React.FC<ResourcesActionBarProps> = React.memo(
  ({
    selectedCount,
    hasSelection,
    isSyncing = false,
    onView,
    onSync,
    onDelete,
  }) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 16,
          paddingLeft: 16,
        }}
      >
        <Space size={8}>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              onClick={onView}
              disabled={!hasSelection || selectedCount > 1}
              size="small"
              style={{
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                color: !hasSelection || selectedCount > 1 ? '#d1d5db' : '#374151',
                background: !hasSelection || selectedCount > 1 ? '#f9fafb' : '#fff',
              }}
            />
          </Tooltip>
          <Tooltip title={isSyncing ? 'Syncing...' : 'Sync'}>
            <Button
              icon={<SyncOutlined spin={isSyncing} />}
              onClick={onSync}
              disabled={!hasSelection || isSyncing}
              size="small"
              type="primary"
              style={{
                borderRadius: 8,
                background: !hasSelection || isSyncing ? '#d1d5db' : DEFAULT_COLORS.SUCCESS,
                borderColor: !hasSelection || isSyncing ? '#d1d5db' : DEFAULT_COLORS.SUCCESS,
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={onDelete}
              disabled={!hasSelection}
              size="small"
              style={{
                borderRadius: 8,
                border: '1px solid #ef4444',
                color: !hasSelection ? '#d1d5db' : '#ef4444',
                background: !hasSelection ? '#f9fafb' : '#fff',
              }}
            />
          </Tooltip>
        </Space>
      </div>
    );
  },
);

ActionBar.displayName = 'ActionBar';
export default ActionBar;
