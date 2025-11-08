import React from 'react';
import PageContainer from './PageContainer';

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message = 'Resource not found' }) => {
  return (
    <PageContainer>
      <div>{message}</div>
    </PageContainer>
  );
};

export default NotFound;

