import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

interface UsersErrorPageProps {
  error: string;
}

const UsersErrorPage: React.FC<UsersErrorPageProps> = memo(({ error }) => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        minHeight: 'calc(100vh - 60px)',
        padding: '48px 32px 32px',
        marginTop: '60px',
      }}
    >
      <div>Error: {error}</div>
    </div>
  );
});

UsersErrorPage.displayName = 'UsersErrorPage';

export default UsersErrorPage;
