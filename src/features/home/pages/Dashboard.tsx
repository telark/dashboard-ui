import React from 'react';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../constants';

const Dashboard: React.FC = () => {
  return (
    <div
      style={{
        padding: '48px 24px 24px',
        marginTop: HEADER_LAYOUT.HEIGHT,
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: HEADER_LAYOUT.MIN_HEIGHT,
      }}
      className="app-root"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(248px, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      ></div>
    </div>
  );
};

export default Dashboard;
