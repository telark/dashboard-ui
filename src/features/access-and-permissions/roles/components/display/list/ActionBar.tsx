import React from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import type { RolesActionBarProps } from '../../../models';

const ActionBar: React.FC<RolesActionBarProps> = React.memo(
  ({ selectedCount, hasSelection, canEdit, canDelete, onView, onEdit, onDelete }) => {
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
          <Tooltip title={canEdit ? 'Edit' : 'Edit is prevented by protection flags'}>
            <Button
              icon={<EditOutlined />}
              onClick={onEdit}
              disabled={!hasSelection || selectedCount > 1 || !canEdit}
              size="small"
              style={{
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                color: hasSelection && selectedCount <= 1 && canEdit ? '#374151' : '#d1d5db',
                background: hasSelection && selectedCount <= 1 && canEdit ? '#fff' : '#f9fafb',
              }}
            />
          </Tooltip>
          <Tooltip title={canDelete ? 'Delete' : 'Delete is prevented by protection flags'}>
            <Button
              icon={<DeleteOutlined />}
              onClick={onDelete}
              disabled={!hasSelection || !canDelete}
              size="small"
              style={{
                borderRadius: 8,
                border: hasSelection && canDelete ? '1px solid #ef4444' : '1px solid #e5e7eb',
                color: hasSelection && canDelete ? '#ef4444' : '#d1d5db',
                background: hasSelection && canDelete ? '#fff' : '#f9fafb',
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
