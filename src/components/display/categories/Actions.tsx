import React from 'react';
import { Button, Dropdown } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { CATEGORIES_CONSTANTS as CC } from '../../../constants/pages/categories';
import type { Category } from '../../../interfaces/categories';

interface ActionsProps {
  record: Category;
  onView: (r: Category) => void;
  onEdit?: (r: Category) => void;
  onDelete: (r: Category) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onEdit, onDelete }) => {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{
          items: [
            { key: 'view', label: CC.LABELS.ACTIONS.VIEW, icon: <EyeOutlined /> },
            { key: 'edit', label: CC.LABELS.ACTIONS.EDIT, icon: <EditOutlined /> },
            {
              key: 'delete',
              label: CC.LABELS.ACTIONS.DELETE,
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: ({ key }) => {
            if (key === 'view') onView(record);
            else if (key === 'edit' && onEdit) onEdit(record);
            else if (key === 'delete') onDelete(record);
          },
        }}
      >
        <Button type="text" shape="circle" icon={<MoreOutlined />} />
      </Dropdown>
    </div>
  );
};

export default Actions;
