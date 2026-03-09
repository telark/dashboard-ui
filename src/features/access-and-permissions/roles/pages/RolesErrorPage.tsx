import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

interface RolesErrorPageProps {
  error: string;
}

const RolesErrorPage: React.FC<RolesErrorPageProps> = memo(({ error }) => {
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

RolesErrorPage.displayName = 'RolesErrorPage';

export default RolesErrorPage;
