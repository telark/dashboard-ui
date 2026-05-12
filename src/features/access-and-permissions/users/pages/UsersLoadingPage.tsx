import React from 'react';
import { SHARED_DETAILS_CONSTANTS, DEFAULT_COLORS, HEADER_LAYOUT } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';

const UsersLoadingPage: React.FC = () => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        minHeight: HEADER_LAYOUT.MIN_HEIGHT,
        padding: '48px 32px 32px',
        marginTop: HEADER_LAYOUT.HEIGHT,
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
