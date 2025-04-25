import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, message } from 'antd';

import { fetchGroupersThunk, checkGrouperMaintenanceModeThunk } from '../store/grouperSlice';
import GrouperCard from '../components/Cards/GrouperCard';
import { RootState, AppDispatch } from '../store';

const Groupers: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { groupers, loading, error } = useSelector(
    (state: RootState) => state.grouper
  );
  
  useEffect(() => {
    const fetchAndCheck = async () => {
      const result = await dispatch(fetchGroupersThunk());
  
      // Once groupers are fetched, dispatch maintenance checks
      if (fetchGroupersThunk.fulfilled.match(result)) {
        result.payload.forEach((grouper: any) => {
          dispatch(checkGrouperMaintenanceModeThunk(grouper.name));
        });
      }
    };
    fetchAndCheck();
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 0fr))',
      gap: '16px',
      padding: '20px',
      marginTop: '60px',
    }}>
      {groupers.map((grouper, index) => (
        <GrouperCard
          key={index}
          {...grouper}
        />
      ))}
    </div>
  );
};

export default Groupers;