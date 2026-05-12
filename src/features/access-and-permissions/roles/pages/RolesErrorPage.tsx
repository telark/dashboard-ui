import React, { memo } from 'react';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../../constants';

interface RolesErrorPageProps {
  error: string;
}

const RolesErrorPage: React.FC<RolesErrorPageProps> = memo(({ error }) => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        minHeight: HEADER_LAYOUT.MIN_HEIGHT,
        padding: '48px 32px 32px',
        marginTop: HEADER_LAYOUT.HEIGHT,
      }}
    >
      <div>Error: {error}</div>
    </div>
  );
});

RolesErrorPage.displayName = 'RolesErrorPage';

export default RolesErrorPage;
