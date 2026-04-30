import React from 'react';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    style={{
      background: 'none',
      border: '1px solid var(--auth-card-border, #e2e8f0)',
      borderRadius: '8px',
      padding: '6px 8px',
      cursor: 'pointer',
      color: 'var(--auth-text-muted, #64748b)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '15px',
      transition: 'border-color 0.15s',
    }}
    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {isDark ? <SunOutlined /> : <MoonOutlined />}
  </button>
);
