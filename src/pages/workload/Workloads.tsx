import React, { useEffect, useState, useCallback } from 'react';
import { Typography, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchWorkloads } from '../../clients/exporter';
import WorkloadList from '../../components/display/WorkloadList';
import type { Workload, WorkloadCardData } from '../../interfaces/workload';
import { APP_ROUTES } from '../../constants';

const { Title, Paragraph } = Typography;

const Workloads: React.FC = () => {
  const [workloads, setWorkloads] = useState<WorkloadCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const transformWorkloadToCardData = (workload: Workload): WorkloadCardData => {
    return {
      name: workload.fasid.name,
      grouper: workload.fasid.grouper,
      status: workload.cacid.status,
      instances: {
        total: workload.cacid.instances.total,
        available: workload.cacid.instances.available,
      },
      containers: workload.cacid.crates.regular.length + workload.cacid.crates.init.length,
      lastUpdate: workload.config.sync.lastUpdateTime,
      sourceType: workload.fasid.sourceType,
      registry: workload.cacid.registry,
      strategy: workload.cacid.strategy,
    };
  };

  const loadWorkloads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWorkloads();
      const transformedWorkloads = response.data.items.map(transformWorkloadToCardData);
      setWorkloads(transformedWorkloads);
    } catch (error: any) {
      console.error('Failed to fetch workloads:', error);
      message.error('Failed to load workloads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkloads();
  }, [loadWorkloads]);

  const handleWorkloadClick = (workload: WorkloadCardData) => {
    navigate(APP_ROUTES.WORKLOAD_DETAILS.replace(':name', workload.name));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Workloads</Title>
        <Paragraph type="secondary">Manage and monitor your application workloads</Paragraph>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <WorkloadList workloads={workloads} onWorkloadClick={handleWorkloadClick} />
      )}
    </div>
  );
};

export default Workloads;
