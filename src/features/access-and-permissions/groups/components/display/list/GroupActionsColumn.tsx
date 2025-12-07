import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { APP_ROUTES } from '../../../../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants';
import type { Group } from '../../../models';

interface GroupActionsColumnProps {
  record: Group;
  onEdit?: (record: Group) => void;
}

export const GroupActionsColumn: React.FC<GroupActionsColumnProps> = ({ record, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`${APP_ROUTES.GROUPS}/${record.id}/view`);
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
        <EyeOutlined />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onEdit) {
            onEdit(record);
          } else {
            navigate(`${APP_ROUTES.GROUPS}/${record.id}/edit`);
          }
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
    </div>
  );
};
