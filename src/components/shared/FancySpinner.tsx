import React from 'react';
import { DEFAULT_COLORS } from '../../constants';

interface FancySpinnerProps {
  label?: string;
  size?: number; // overall diameter in px
  ringThickness?: number; // border thickness in px
  color?: string; // primary color
  showLabel?: boolean; // show/hide label
}

const FancySpinner: React.FC<FancySpinnerProps> = ({
  label = 'Loading…',
  size = 32,
  ringThickness = 2,
  color = DEFAULT_COLORS.SUCCESS,
  showLabel = false,
}) => {

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: showLabel ? 12 : 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        {/* Single rotating ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `${ringThickness}px solid rgba(32,201,151,0.15)`,
            borderTopColor: color,
            animation: 'fancy-spin 0.9s linear infinite',
          }}
        />

      </div>
      {showLabel && <div style={{ color: '#5B6B7C', fontSize: 13 }}>{label}</div>}
      <style>{`
        @keyframes fancy-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FancySpinner;
