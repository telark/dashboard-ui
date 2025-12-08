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
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
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
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
        }}
      >
        <EditOutlined />
      </button>
    </div>
  );
};
