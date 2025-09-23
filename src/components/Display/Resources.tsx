import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  FileOutlined,
  SyncOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Pagination, Space } from 'antd';
import { ResourcesInterface } from '../../interfaces/common';
import TimeAgo from '../time/TimeAgo';

const Resources: React.FC<ResourcesInterface> = ({ name, resources }) => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSync = (resourceName: string) => {
    void resourceName;
    // future: implement sync functionality
  };

  const handleDelete = (resourceName: string) => {
    void resourceName;
    // future: delete resource
  };

  const handleView = (resourceName: string) => {
    navigate(`/groupers/${name}/details/${resourceName}`);
  };

  // Paginate resources based on current page and pageSize
  const paginatedResources = resources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Check if pagination is necessary (only show pagination if there are more than 5 resources)
  const showPagination = resources.length > pageSize;

  return (
    <>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'center',
          tableLayout: 'fixed',
          marginBottom: '16px',
        }}
      >
        <thead>
          <tr>
            <th>
              <AppstoreOutlined /> Resource Name
            </th>
            <th>
              <ClockCircleOutlined /> Last Sync
            </th>
            <th>
              <FileOutlined /> Kind
            </th>
            <th>
              <SyncOutlined /> Status
            </th>
            <th> {/* Empty header for Action icons */} </th>
          </tr>
        </thead>
        <tbody>
          {paginatedResources.map((resource, index) => (
            <tr key={index}>
              {/* Resource Name, Last Sync, Kind, Status */}
              <td>{resource.name}</td>
              <td>
                <TimeAgo date={resource.lastSync} />
              </td>
              <td>{resource.type}</td>
              <td>{resource.status}</td>

              {/* Action Icons */}
              <td style={{ padding: '8px' }}>
                <Space>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleView(resource.name)}
                    size="small"
                    type="default"
                  />
                  <Button
                    icon={<SyncOutlined />}
                    onClick={() => handleSync(resource.name)}
                    size="small"
                    type="primary"
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(resource.name)}
                    size="small"
                    danger
                  />
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination component, only show if more than 5 resources */}
      {showPagination && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={resources.length}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default Resources;
