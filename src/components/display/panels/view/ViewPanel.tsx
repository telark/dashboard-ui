import React from 'react';
import { Avatar, Tooltip } from 'antd';
import AnimationWrapper from '../slide-out/AnimationWrapper';

interface ViewAvatar {
  key: string;
  src?: string;
  fallback?: string;
  tooltip: string;
}

interface ViewOverflowItem {
  key: string;
  src?: string;
  username: string;
}

interface ViewDetailRow {
  label: string;
  value: React.ReactNode;
}

interface ViewPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  name: string;
  description?: string;
  avatars?: ViewAvatar[];
  overflowItems?: ViewOverflowItem[];
  width?: number;
  details?: ViewDetailRow[];
}

const DEFAULT_WIDTH = 520;
const MAX_VISIBLE_AVATARS = 5;

const ViewPanel: React.FC<ViewPanelProps> = ({
  open,
  onClose,
  title,
  icon,
  name,
  description,
  avatars = [],
  overflowItems = [],
  width = DEFAULT_WIDTH,
  details = [],
}) => {
  const hasOverflow = avatars.length > MAX_VISIBLE_AVATARS;
  const visibleAvatars = avatars.slice(0, MAX_VISIBLE_AVATARS);
  const overflowCount = avatars.length - MAX_VISIBLE_AVATARS;

  return (
    <AnimationWrapper open={open} onClose={onClose} title={title} width={width}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            paddingBottom: 20,
            borderBottom: '1px solid #eef2f6',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(32, 201, 151, 0.35)',
            }}
          >
            {icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginTop: -4 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: '#0B1F33',
                letterSpacing: '-0.02em',
                textTransform: 'capitalize',
              }}
            >
              {name}
            </h3>
            {description && (
              <p
                style={{
                  margin: '0 0 4px 0',
                  fontSize: 13,
                  color: '#64748b',
                  textAlign: 'center',
                  maxWidth: '360px',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}
              >
                {description}
              </p>
            )}
            {avatars.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                {visibleAvatars.map((avatar, index) => (
                  <Tooltip key={avatar.key} title={avatar.tooltip} placement="top">
                    <Avatar
                      src={avatar.src}
                      size={32}
                      style={{
                        border: '1.5px solid #20C997',
                        padding: 1.5,
                        background: '#fff',
                        boxSizing: 'border-box',
                        marginLeft: index === 0 ? 0 : -10,
                        boxShadow: '0 0 0 2px #fff',
                      }}
                    >
                      {!avatar.src && avatar.fallback ? avatar.fallback : null}
                    </Avatar>
                  </Tooltip>
                ))}
                {hasOverflow && (
                  <Tooltip
                    title={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {overflowItems.map((user) => (
                          <div
                            key={user.key}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Avatar src={user.src} size={24} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user.username}</span>
                          </div>
                        ))}
                      </div>
                    }
                    placement="top"
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#20C997',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 12,
                        marginLeft: -6,
                        boxShadow: '0 0 0 3px #fff',
                        zIndex: 1,
                        cursor: 'default',
                      }}
                    >
                      +{overflowCount}
                    </div>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 12 }}>
          {details.map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {row.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default ViewPanel;
