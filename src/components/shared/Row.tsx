import React from 'react';

export interface RowProps {
  left: React.ReactNode;
  right: React.ReactNode;
  withDivider?: boolean;
}

const Row: React.FC<RowProps> = ({ left, right, withDivider = true }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: withDivider ? '1px solid #eef2f6' : 'none',
      minHeight: 40,
    }}
  >
    <div>{left}</div>
    <div style={{ color: '#111827', fontWeight: 600 }}>{right}</div>
  </div>
);

export default Row;
