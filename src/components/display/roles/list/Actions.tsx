import React from 'react';
import { Button, Dropdown } from 'antd';
import { EyeOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import type { Role } from '../../../../interfaces/roles';

interface ActionsProps {
  record: Role;
  onView: (r: Role) => void;
  onDelete: (r: Role) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onDelete }) => {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: [
          { key: 'view', label: RPC.LABELS.ACTIONS.VIEW, icon: <EyeOutlined /> },
          {
            key: 'delete',
            label: RPC.LABELS.ACTIONS.DELETE,
            icon: <DeleteOutlined />,
            danger: true,
          },
        ],
        onClick: ({ key }) => (key === 'view' ? onView(record) : onDelete(record)),
      }}
    >
      <Button type="text" shape="circle" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default Actions;
