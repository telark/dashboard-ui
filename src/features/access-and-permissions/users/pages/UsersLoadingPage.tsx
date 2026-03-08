import React from 'react';
import { SHARED_DETAILS_CONSTANTS, DEFAULT_COLORS } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';

const UsersLoadingPage: React.FC = () => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        minHeight: 'calc(100vh - 60px)',
        padding: '48px 32px 32px',
        marginTop: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FancySpinner label={SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
    </div>
  );
};

export default UsersLoadingPage;
