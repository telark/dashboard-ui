import React, { memo } from 'react';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../../constants';

interface UsersErrorPageProps {
  error: string;
}

const UsersErrorPage: React.FC<UsersErrorPageProps> = memo(({ error }) => {
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

UsersErrorPage.displayName = 'UsersErrorPage';

export default UsersErrorPage;
