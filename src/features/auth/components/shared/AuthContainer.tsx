import React from 'react';
import { Row, Col } from 'antd';

interface AuthContainerProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children, leftPanel }) => {
  if (leftPanel) {
    return (
      <Row style={{ minHeight: '100vh', width: '100%' }}>
        <Col
          xs={0}
          md={11}
          style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 60%, #0c2340 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 48px',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'rgba(32, 201, 151, 0.06)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              left: '-60px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'rgba(32, 201, 151, 0.04)',
              pointerEvents: 'none',
            }}
          />
          {leftPanel}
        </Col>
        <Col
          xs={24}
          md={13}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            padding: '40px 20px',
            minHeight: '100vh',
          }}
        >
          {children}
        </Col>
      </Row>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '20px',
      }}
    >
      {children}
    </div>
  );
};
