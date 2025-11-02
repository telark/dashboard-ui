import React from 'react';
import { Button, Dropdown } from 'antd';
import { EyeOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { ROLE_CATEGORIES_CONSTANTS as RCC } from '../../../../constants/pages/roleCategories';
import type { RoleCategory } from '../../../../interfaces/roles';

interface ActionsProps {
  record: RoleCategory;
  onView: (r: RoleCategory) => void;
  onDelete: (r: RoleCategory) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onDelete }) => {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: [
          { key: 'view', label: RCC.LABELS.ACTIONS.VIEW, icon: <EyeOutlined /> },
          { key: 'delete', label: RCC.LABELS.ACTIONS.DELETE, icon: <DeleteOutlined />, danger: true },
        ],
        onClick: ({ key }) => (key === 'view' ? onView(record) : onDelete(record)),
      }}
    >
      <Button type="text" shape="circle" icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export default Actions;


