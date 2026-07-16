import React from 'react';
import { SHARED_DETAILS_CONSTANTS, DEFAULT_COLORS } from '../../../../constants';
import FullPageLoader from '../../../../components/display/views/FullPageLoader';

const PasskeysLoadingPage: React.FC = () => (
  <div style={{ background: DEFAULT_COLORS.BACKGROUND_WHITE, minHeight: '100vh' }}>
    <FullPageLoader label={SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING} minHeight="100%" />
  </div>
);

export default PasskeysLoadingPage;
