import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants';

interface FancySpinnerProps {
  label?: string;
}

const FancySpinner: React.FC<FancySpinnerProps> = ({ label = 'Loading…' }) => {
  const size = 64;
  const ringThickness = 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        <div
          className="fancy-ring-1"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `${ringThickness}px solid rgba(32,201,151,0.15)`,
            borderTopColor: DEFAULT_COLORS.SUCCESS,
            animation: 'fancy-spin 0.9s linear infinite',
          }}
        />
        <div
          className="fancy-ring-2"
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            border: `${ringThickness}px solid rgba(32,201,151,0.12)`,
            borderLeftColor: DEFAULT_COLORS.SUCCESS,
            animation: 'fancy-spin 1.2s linear infinite reverse',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: DEFAULT_COLORS.SUCCESS,
          }}
        >
          <AppstoreOutlined style={{ fontSize: 22 }} />
        </div>
      </div>
      <div style={{ color: '#5B6B7C', fontSize: 13 }}>{label}</div>
      <style>{`
        @keyframes fancy-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FancySpinner;
