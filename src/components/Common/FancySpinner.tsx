import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants';

interface FancySpinnerProps {
  label?: string;
  size?: number; // overall diameter in px
  ringThickness?: number; // border thickness in px
  color?: string; // primary color
  icon?: React.ReactNode; // custom icon inside
  showLabel?: boolean; // show/hide label
  orbit?: boolean; // if true, icon revolves around the ring
}

const FancySpinner: React.FC<FancySpinnerProps> = ({
  label = 'Loading…',
  size = 64,
  ringThickness = 2,
  color = DEFAULT_COLORS.SUCCESS,
  icon,
  showLabel = true,
  orbit = false,
}) => {
  const innerIcon = icon || <AppstoreOutlined />;
  const iconFontSize = Math.max(12, Math.round(size * 0.35));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: showLabel ? 12 : 0 }}>
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

        {/* Icon: either orbiting around the ring or centered, following the same direction */}
        {orbit ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              animation: 'fancy-spin 0.9s linear infinite', // same direction as ring
              transformOrigin: '50% 50%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: ringThickness, // start near the top edge
                transform: 'translate(-50%, 0)',
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: iconFontSize,
              }}
            >
              {innerIcon}
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontSize: iconFontSize,
              animation: 'fancy-spin 1.1s linear infinite', // rotate icon in place
            }}
          >
            {innerIcon}
          </div>
        )}
      </div>
      {showLabel && <div style={{ color: '#5B6B7C', fontSize: 13 }}>{label}</div>}
      <style>{`
        @keyframes fancy-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FancySpinner;
