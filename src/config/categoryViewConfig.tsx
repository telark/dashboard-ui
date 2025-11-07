import { AiOutlineTag, AiOutlineFileText, AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import type { Category } from '../interfaces/categories';
import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import { Space } from 'antd';
import { StatusTag } from '../components/tags';

export const createCategoryViewConfig = (category: Category): ViewDetailsConfig => {
  let typeColor: string;
  if (category.type === 'default') {
    typeColor = '#3b82f6';
  } else if (category.type === 'system') {
    typeColor = '#9333ea';
  } else {
    typeColor = '#06b6d4';
  }

  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: category.name,
        icon: <AiOutlineTag />,
        type: 'text',
      },
      {
        key: 'description',
        label: 'Description',
        value: category.description,
        icon: <AiOutlineFileText />,
        type: 'text',
      },
      {
        key: 'type',
        label: 'Type',
        value: <StatusTag label={category.type} icon={<AiOutlineTag />} color={typeColor} />,
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'createdAt',
        label: 'Created At',
        value: new Date(category.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        icon: <AiOutlineCalendar />,
        type: 'text',
      },
      {
        key: 'usedBy',
        label: 'Used By',
        value:
          category.usedBy && category.usedBy.length > 0 ? (
            <Space wrap>
              {category.usedBy.map((item) => (
                <StatusTag key={item} label={item} color="#9333ea" borderColor="#9333ea" />
              ))}
            </Space>
          ) : (
            <span style={{ color: '#999', fontStyle: 'italic' }}>Not used by any roles</span>
          ),
        icon: <AiOutlineUser />,
        type: 'custom',
      },
    ],
  };
};
