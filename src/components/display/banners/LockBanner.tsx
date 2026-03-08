import React from 'react';

export interface LockBannerProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const LockBanner: React.FC<LockBannerProps> = ({ title, message, icon }) => {
  return (
    <>
      <div
        style={{
          background: '#f6f8fa',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          border: '1px solid #d0d7de',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          animation: 'lockBannerFadeIn 0.3s ease-out',
        }}
      >
        {icon && <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>}
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: '#24292f',
              fontWeight: 500,
              fontSize: 14,
              marginBottom: 2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: '#656d76',
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            {message}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes lockBannerFadeIn {
          0% { 
            opacity: 0; 
            transform: translateY(-8px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </>
  );
};

export default LockBanner;
