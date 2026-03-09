import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';

interface PasskeysErrorPageProps {
  error: string;
}

const PasskeysErrorPage: React.FC<PasskeysErrorPageProps> = memo(({ error }) => (
  <div
    style={{
      background: DEFAULT_COLORS.BACKGROUND_WHITE,
      minHeight: '100vh',
      padding: '100px 48px 48px',
      marginTop: 0,
    }}
  >
    <div>Error: {error}</div>
  </div>
));

PasskeysErrorPage.displayName = 'PasskeysErrorPage';

export default PasskeysErrorPage;
