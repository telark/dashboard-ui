import React from 'react';

interface LoginContainerProps {
  children: React.ReactNode;
}

export const LoginContainer: React.FC<LoginContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#ffffff',
        padding: '20px',
      }}
    >
      {children}
    </div>
  );
};

