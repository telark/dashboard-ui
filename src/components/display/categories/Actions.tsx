import React from 'react';
import { Button, Dropdown } from 'antd';
import { EyeOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { CATEGORIES_CONSTANTS as CC } from '../../../constants/pages/categories';
import type { Category } from '../../../interfaces/categories';

interface ActionsProps {
  record: Category;
  onView: (r: Category) => void;
  onDelete: (r: Category) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onDelete }) => {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: [
          { key: 'view', label: CC.LABELS.ACTIONS.VIEW, icon: <EyeOutlined /> },
          {
            key: 'delete',
            label: CC.LABELS.ACTIONS.DELETE,
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
