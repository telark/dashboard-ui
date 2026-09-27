import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';

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
          background: DEFAULT_COLORS.SURFACE_SUBTLE,
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
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
              color: DEFAULT_COLORS.TEXT_ON_SURFACE,
              fontWeight: 500,
              fontSize: 14,
              marginBottom: 2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
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
