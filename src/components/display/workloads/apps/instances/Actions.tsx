import React from 'react';
import { Button, Dropdown } from 'antd';
import { EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { INSTANCES_PAGE_CONSTANTS as IPC } from '../../../../../constants/pages/instances';
import type { InstanceTableRow } from '../../../../../interfaces/resources/instances';

interface ActionsProps {
  record: InstanceTableRow;
  onView: (r: InstanceTableRow) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView }) => {
  return (
    <div onClick={(e) => e.stopPropagation()} role="presentation">
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{
          items: [{ key: 'view', label: IPC.LABELS.ACTIONS.VIEW, icon: <EyeOutlined /> }],
          onClick: ({ key }) => {
            if (key === 'view') onView(record);
          },
        }}
      >
        <Button type="text" shape="circle" icon={<MoreOutlined />} />
      </Dropdown>
    </div>
  );
};

export default Actions;
