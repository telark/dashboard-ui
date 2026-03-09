import React from 'react';
import { SHARED_DETAILS_CONSTANTS, DEFAULT_COLORS } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';

const PasskeysLoadingPage: React.FC = () => (
  <div
    style={{
      background: DEFAULT_COLORS.BACKGROUND_WHITE,
      minHeight: '100vh',
      padding: '100px 48px 48px',
      marginTop: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <FancySpinner label={SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING} showLabel />
  </div>
);

export default PasskeysLoadingPage;
