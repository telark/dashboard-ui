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
    <div style={{ padding: '20px', margin: "auto", marginTop: '80px',}}>
      {groupers.length === 0 ? (
        <Empty description="No Groupers Found" />
      ) : (
        <Row gutter={[16, 16]}>
          {groupers.map((grouper, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <GrouperCard {...grouper} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Groupers;
