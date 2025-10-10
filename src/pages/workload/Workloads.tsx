import React, { useEffect } from 'react';
import { Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllWorkloadsThunk } from '../../store/slices/workloadSlice';
import WorkloadList from '../../components/display/WorkloadList';
import type { WorkloadCardData } from '../../interfaces/workload';
import { APP_ROUTES } from '../../constants';
import type { RootState, AppDispatch } from '../../store';

const { Title, Paragraph } = Typography;

const Workloads: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { workloads, loading, error } = useSelector((state: RootState) => state.workload);

  useEffect(() => {
    dispatch(fetchAllWorkloadsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error('Failed to load workloads');
    }
  }, [error]);

  const handleWorkloadClick = (workload: WorkloadCardData) => {
    navigate(APP_ROUTES.WORKLOAD_DETAILS.replace(':name', workload.name));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Workloads</Title>
      </div>

      <WorkloadList
        workloads={workloads}
        loading={loading}
        onWorkloadClick={handleWorkloadClick}
      />
    </div>
  );
};

export default Workloads;
