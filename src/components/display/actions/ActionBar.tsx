import React, { useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export interface ActionBarProps {
  selectedCount: number;
  hasSelection: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  tooltip: string;
  isDanger?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  disabled,
  tooltip,
  isDanger = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getButtonStyles = () => {
    if (disabled) {
      return {
        cursor: 'not-allowed',
        color: '#d1d5db',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
      };
    }

    if (isDanger) {
      return {
        cursor: 'pointer',
        color: isHovered ? '#fff' : '#ef4444',
        background: isHovered ? '#ef4444' : 'transparent',
        border: 'none',
        boxShadow: isHovered ? '0 2px 8px rgba(239, 68, 68, 0.2)' : 'none',
      };
    }

    return {
      cursor: 'pointer',
      color: isHovered ? '#20C997' : '#64748b',
      background: isHovered ? '#f0fdfa' : 'transparent',
      border: 'none',
      boxShadow: isHovered ? '0 2px 8px rgba(32, 201, 151, 0.15)' : 'none',
    };
  };

  const styles = getButtonStyles();

  return (
    <Tooltip title={tooltip}>
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        style={{
          all: 'unset',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 6,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: 14,
          ...styles,
        }}
      >
        {icon}
      </button>
    </Tooltip>
  );
};

const ActionBar: React.FC<ActionBarProps> = React.memo(
  ({ selectedCount, hasSelection, canEdit = true, canDelete = true, onView, onEdit, onDelete }) => {
    const isViewEnabled = hasSelection && selectedCount <= 1;
    const isEditEnabled = hasSelection && selectedCount <= 1 && canEdit;
    const isDeleteEnabled = hasSelection && canDelete;

    const getEditTooltip = () => {
      if (!hasSelection || selectedCount > 1) {
        return 'Edit';
      }
      return canEdit ? 'Edit' : 'Edit is prevented by protection flags';
    };

    const getDeleteTooltip = () => {
      if (!hasSelection) {
        return 'Delete';
      }
      return canDelete ? 'Delete' : 'Delete is prevented by protection flags';
    };

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 12,
          padding: '8px 0',
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          <ActionButton
            icon={<EyeOutlined />}
            onClick={onView}
            disabled={!isViewEnabled}
            tooltip="View"
          />
          <ActionButton
            icon={<EditOutlined />}
            onClick={onEdit}
            disabled={!isEditEnabled}
            tooltip={getEditTooltip()}
          />
          {onDelete && (
            <ActionButton
              icon={<DeleteOutlined />}
              onClick={onDelete}
              disabled={!isDeleteEnabled}
              tooltip={getDeleteTooltip()}
              isDanger={true}
            />
          )}
        </div>
      </div>
    );
  },
);

ActionBar.displayName = 'ActionBar';
export default ActionBar;
