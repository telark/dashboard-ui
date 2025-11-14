import { Button, Dropdown } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';

export interface RowOptionsLabels {
  VIEW: string;
  EDIT: string;
  DELETE: string;
}

interface RowOptionsProps<T> {
  record: T;
  labels: RowOptionsLabels;
  onView: (r: T) => void;
  onEdit?: (r: T) => void;
  onDelete: (r: T) => void;
}

const RowOptions = <T,>({ record, labels, onView, onEdit, onDelete }: RowOptionsProps<T>) => {
  const menuItems = [
    {
      key: 'view',
      label: labels.VIEW,
      icon: <EyeOutlined />,
      onClick: () => {
        onView(record);
      },
    },
    {
      key: 'edit',
      label: labels.EDIT,
      icon: <EditOutlined />,
      onClick: () => {
        if (onEdit) {
          onEdit(record);
        }
      },
    },
    {
      key: 'delete',
      label: labels.DELETE,
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        onDelete(record);
      },
    },
  ];

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
        menu={{ items: menuItems }}
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

export default RowOptions;
