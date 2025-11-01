import React from 'react';
import { EyeOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Space, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import { ResourcesActionBarProps } from '../../../interfaces/grouper';

const ResourcesActionBar: React.FC<ResourcesActionBarProps> = React.memo(
  ({
    selectedCount,
    hasSelection,
    allPageResourcesSelected,
    somePageResourcesSelected,
    onSelectAll,
    onView,
    onSync,
    onDelete,
  }) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          paddingLeft: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Checkbox
            indeterminate={somePageResourcesSelected && !allPageResourcesSelected}
            checked={allPageResourcesSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          >
            {hasSelection && (
              <span style={{ color: '#5B6B7C', fontSize: 14 }}>{selectedCount} selected</span>
            )}
          </Checkbox>
        </div>

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
          <Tooltip title="Sync">
            <Button
              icon={<SyncOutlined />}
              onClick={onSync}
              disabled={!hasSelection}
              size="small"
              type="primary"
              style={{
                borderRadius: 8,
                background: !hasSelection ? '#d1d5db' : DEFAULT_COLORS.SUCCESS,
                borderColor: !hasSelection ? '#d1d5db' : DEFAULT_COLORS.SUCCESS,
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

ResourcesActionBar.displayName = 'ResourcesActionBar';
export default ResourcesActionBar;

