import React from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ResourceRowInterface } from '../../../interfaces/common';
import TimeAgo from '../../time/TimeAgo';

const ResourceRow: React.FC<ResourceRowInterface> = ({ name, lastSync, type, status }) => (
  <tr>
    <td>{name}</td>
    <td>
      <TimeAgo date={lastSync} />
    </td>
    <td>{type}</td>
    <td>{status}</td>
    <td>
      <Button
        icon={<EyeOutlined />}
        type="link"
        onClick={() => {
          // future: open details drawer
        }}
      />
    </td>
  </tr>
);

export default ResourceRow;
