import React from 'react';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../constants';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = 'app-root' }) => {
  return (
    <div
      style={{
        padding: '48px 24px 24px',
        marginTop: HEADER_LAYOUT.HEIGHT,
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: HEADER_LAYOUT.MIN_HEIGHT,
      }}
      className={className}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
};

export default PageContainer;
