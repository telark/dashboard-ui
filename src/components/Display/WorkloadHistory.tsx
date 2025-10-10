import React from 'react';
import { Table, Tag } from 'antd';
import { Workload } from '../../interfaces/workload';

interface WorkloadHistoryProps {
  workload: Workload;
}

const WorkloadHistory: React.FC<WorkloadHistoryProps> = ({ workload }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'running':
        return 'success';
      case 'inactive':
      case 'stopped':
        return 'default';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Table
      dataSource={workload.config?.history || []}
      columns={[
        {
          title: 'Timestamp',
          dataIndex: 'timestamp',
          key: 'timestamp',
          render: (timestamp: string) => timestamp ? formatTime(timestamp) : 'N/A',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (status: string) => (
            <Tag color={getStatusColor(status)}>{status}</Tag>
          ),
        },
        {
          title: 'Message',
          dataIndex: 'message',
          key: 'message',
        },
      ]}
      pagination={false}
      rowKey="timestamp"
    />
  );
};

export default WorkloadHistory;
