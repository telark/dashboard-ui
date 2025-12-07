import React from 'react';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';
import type { ToolbarConfig } from '../../../interfaces/layout/toolbar';

interface ToolbarProps {
  config: ToolbarConfig;
}

const Toolbar: React.FC<ToolbarProps> = ({ config }) => {
  const { buttons } = config;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {buttons.map((button) => {
        const isPrimary = button.variant === 'primary';
        const isGhost = button.variant === 'ghost';

        if (button.dropdown) {
          return (
            <Dropdown
              key={button.key}
              menu={{
                items: button.dropdown.items,
                onClick: ({ key }) => {
                  button.dropdown?.onItemClick?.(key);
                },
              }}
              trigger={['click']}
            >
              <button
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: isGhost ? '6px 12px' : '6px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  border: isGhost
                    ? 'none'
                    : `1px solid ${isPrimary ? DEFAULT_COLORS.SUCCESS : '#d9d9d9'}`,
                  backgroundColor: isPrimary
                    ? DEFAULT_COLORS.SUCCESS
                    : button.active
                      ? '#e6f7ff'
                      : 'transparent',
                  color: isPrimary ? '#fff' : '#64748b',
                  fontFamily: "'Roboto Condensed', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (isPrimary) {
                    e.currentTarget.style.opacity = '0.9';
                  } else if (!button.active) {
                    e.currentTarget.style.backgroundColor = isGhost ? '#f5f5f5' : '#f5f5f5';
                    if (!isGhost) {
                      e.currentTarget.style.borderColor = DEFAULT_COLORS.SUCCESS;
                      e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (isPrimary) {
                    e.currentTarget.style.opacity = '1';
                  } else {
                    e.currentTarget.style.backgroundColor = button.active
                      ? '#e6f7ff'
                      : 'transparent';
                    if (!isGhost) {
                      e.currentTarget.style.borderColor = '#d9d9d9';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }
                }}
              >
                {button.icon && (
                  <span
                    style={{ fontSize: 14, display: 'flex', alignItems: 'center', lineHeight: 1 }}
                  >
                    {button.icon}
                  </span>
                )}
                <span>{button.label}</span>
                <DownOutlined style={{ fontSize: 10 }} />
              </button>
            </Dropdown>
          );
        }

        return (
          <button
            key={button.key}
            onClick={button.onClick}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: isGhost ? '6px 12px' : '6px 16px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              border: isGhost
                ? 'none'
                : `1px solid ${isPrimary ? DEFAULT_COLORS.SUCCESS : '#d9d9d9'}`,
              backgroundColor: isPrimary
                ? DEFAULT_COLORS.SUCCESS
                : button.active
                  ? '#e6f7ff'
                  : 'transparent',
              color: isPrimary ? '#fff' : '#64748b',
              fontFamily: "'Roboto Condensed', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (isPrimary) {
                e.currentTarget.style.opacity = '0.9';
              } else if (!button.active) {
                e.currentTarget.style.backgroundColor = isGhost ? '#f5f5f5' : '#f5f5f5';
                if (!isGhost) {
                  e.currentTarget.style.borderColor = DEFAULT_COLORS.SUCCESS;
                  e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
                }
              }
            }}
            onMouseLeave={(e) => {
              if (isPrimary) {
                e.currentTarget.style.opacity = '1';
              } else {
                e.currentTarget.style.backgroundColor = button.active ? '#e6f7ff' : 'transparent';
                if (!isGhost) {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                  e.currentTarget.style.color = '#64748b';
                }
              }
            }}
          >
            {button.icon && (
              <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                {button.icon}
              </span>
            )}
            <span>{button.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;
