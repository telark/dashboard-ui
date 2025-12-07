import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../../constants';
import type { Category } from '../../../models';

interface CategoryActionsColumnProps {
  record: Category;
  onEdit?: (record: Category) => void;
  onDelete?: (record: Category) => void;
}

export const CategoryActionsColumn: React.FC<CategoryActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
      }}
    >
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(record);
          }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: 16,
            width: 28,
            height: 28,
            borderRadius: 4,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0fdfa';
            e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <EditOutlined />
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(record);
          }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: 16,
            width: 28,
            height: 28,
            borderRadius: 4,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <DeleteOutlined />
        </button>
      )}
    </div>
  );
};

