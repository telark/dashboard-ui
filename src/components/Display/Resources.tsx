import React from 'react';
import { AppstoreOutlined, ClockCircleOutlined, FileOutlined, SyncOutlined } from '@ant-design/icons';
import { ResourcesInterface } from '../../interfaces/common';
import ResourceRow from './ResourceRow';
  
const Resources: React.FC<ResourcesInterface> = ({ resources }) => (
<table
 style={{
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    tableLayout: "fixed",
    marginBottom: "-5px"
  }}>
    <thead>
    <tr>
        <th><AppstoreOutlined /> Resource Name</th>
        <th><ClockCircleOutlined /> Last Sync</th>
        <th><FileOutlined /> Kind</th>
        <th><SyncOutlined /> Status</th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    {resources.map((resource, index) => (
        <ResourceRow key={index} name={resource.name} lastSync={resource.lastSync} kind={resource.kind} status={resource.status} />
    ))}
    </tbody>
</table>
);
  
export default Resources;