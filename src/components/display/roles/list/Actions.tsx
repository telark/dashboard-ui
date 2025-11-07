import React from 'react';
import { Button, Dropdown } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import type { Role } from '../../../../interfaces/roles';

interface ActionsProps {
  record: Role;
  onView: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete: (r: Role) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onEdit, onDelete }) => {
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'view') onView(record);
    else if (key === 'edit' && onEdit) onEdit(record);
    else if (key === 'delete') onDelete(record);
  };

  return (
    <span
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
        }
      }}
    >
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{
          items: [
            { key: 'view', label: RPC.LABELS.ACTIONS.VIEW, icon: <EyeOutlined /> },
            { key: 'edit', label: RPC.LABELS.ACTIONS.EDIT, icon: <EditOutlined /> },
            {
              key: 'delete',
              label: RPC.LABELS.ACTIONS.DELETE,
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: handleMenuClick,
        }}
      >
        <Button
          type="text"
          shape="circle"
          icon={<MoreOutlined />}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
            }
          }}
        />
      </Dropdown>
    </span>
  );
};

export default Actions;
