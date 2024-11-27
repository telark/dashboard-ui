import React from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ResourceRowInterface } from '../../interfaces/common';
import TimeAgo from "../Time/TimeAgo";

const ResourceRow: React.FC<ResourceRowInterface> = ({ name, lastSync, kind, status }) => (
  <tr>
    <td>{name}</td>
    <td><TimeAgo date={lastSync}/></td>
    <td>{kind}</td>
    <td>{status}</td>
    <td>
      <Button
        icon={<EyeOutlined />}
        type="link"
        onClick={() => console.log('View details for', name)}
      />
    </td>
  </tr>
);

export default ResourceRow;




