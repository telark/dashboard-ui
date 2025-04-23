import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Empty, message } from 'antd';
import GrouperCard from '../Cards/GrouperCard';
import { RootState, AppDispatch } from '../../store';
import { fetchGroupersThunk } from '../../store/grouperSlice';

const Groupers: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { groupers, loading, error } = useSelector((state: RootState) => state.grouper);

  useEffect(() => {
    dispatch(fetchGroupersThunk());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 0fr))',
      gap: '16px',
      padding: '20px',
      marginTop: '60px',
    }}>
      {groupers.map((grouper, index) => (
        <GrouperCard key={index} {...grouper} />
      ))}
    </div>
  );
  
  
};

export default Groupers;
