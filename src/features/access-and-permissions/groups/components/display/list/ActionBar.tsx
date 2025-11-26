import React from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';

interface GroupsActionBarProps {
  selectedCount: number;
  hasSelection: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionBar: React.FC<GroupsActionBarProps> = React.memo(
  ({ selectedCount, hasSelection, onView, onEdit, onDelete }) => {
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
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={onEdit}
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
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={onDelete}
              disabled={!hasSelection}
              size="small"
              style={{
                borderRadius: 8,
                border: hasSelection ? '1px solid #ef4444' : '1px solid #e5e7eb',
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
