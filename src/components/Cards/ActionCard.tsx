import React, { useState } from 'react';
import { RightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants';

export interface ActionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  rightLabel?: string;
  footerTag?: string;
  footerBg?: string;
  footerTextColor?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, onClick, rightLabel, footerTag, footerBg, footerTextColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFEFF 100%)',
        width: '100%',
        padding: '12px 16px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: isHovered
          ? '0 12px 30px rgba(0, 0, 0, 0.10)'
          : '0 8px 22px rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        minHeight: 84,
        lineHeight: 1,
        transition: 'all 180ms ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(32, 201, 151, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: DEFAULT_COLORS.SUCCESS,
              boxShadow: 'inset 0 0 0 2px rgba(32, 201, 151, 0.18), 0 6px 12px rgba(32, 201, 151, 0.08)'
            }}
          >
            {icon}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '16px', color: '#0B1F33', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {title}
            </div>
            {description ? (
              <div style={{ fontSize: '13px', color: '#5B6B7C', marginTop: 2 }}>{description}</div>
            ) : null}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {rightLabel ? (
            <div style={{ color: '#5B6B7C', fontSize: 13, whiteSpace: 'nowrap' }}>{rightLabel}</div>
          ) : null}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isHovered ? DEFAULT_COLORS.SUCCESS : '#F3F6F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isHovered ? '#FFFFFF' : '#5B6B7C',
              transition: 'all 180ms ease'
            }}
          >
            <RightOutlined style={{ fontSize: 12, transform: isHovered ? 'translateX(1px)' : 'translateX(0)' }} />
          </div>
        </div>
      </div>
      {footerTag ? (
        <div
          style={{
            marginTop: 8,
            alignSelf: 'flex-start',
            background:
              footerBg || 'linear-gradient(180deg, rgba(32,201,151,0.12) 0%, rgba(32,201,151,0.18) 100%)',
            color: footerTextColor || DEFAULT_COLORS.SUCCESS,
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <ClockCircleOutlined style={{ fontSize: 12 }} />
          {footerTag}
        </div>
      ) : null}
    </button>
  );
};

export default ActionCard;


