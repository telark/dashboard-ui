import React from 'react';
import { EyeOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import { ResourcesActionBarProps } from '../../../../interfaces/grouper';

const ActionBar: React.FC<ResourcesActionBarProps> = React.memo(
  ({ selectedCount, hasSelection, isSyncing = false, onView, onSync, onDelete }) => {
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
                color: hasSelection && selectedCount <= 1 ? '#374151' : '#d1d5db',
                background: hasSelection && selectedCount <= 1 ? '#fff' : '#f9fafb',
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
                background: hasSelection && !isSyncing ? DEFAULT_COLORS.SUCCESS : '#d1d5db',
                borderColor: hasSelection && !isSyncing ? DEFAULT_COLORS.SUCCESS : '#d1d5db',
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
                color: hasSelection ? '#ef4444' : '#d1d5db',
                background: hasSelection ? '#fff' : '#f9fafb',
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
