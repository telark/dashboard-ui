import React from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../../constants/shared/pages';
import { FancySpinner } from '../../../../../components/animation';
import { APPLICATIONS_CONSTANTS } from '../../constants';

const ApplicationsLoadingPage: React.FC = () => (
  <div
    style={{
      background: DEFAULT_COLORS.BACKGROUND_WHITE,
      minHeight: `calc(100vh - ${PAGE_CONTENT_LAYOUT.HEADER_OFFSET_PX}px)`,
      padding: '48px 32px 32px',
      marginTop: `${PAGE_CONTENT_LAYOUT.HEADER_OFFSET_PX}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <FancySpinner label={APPLICATIONS_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
  </div>
);

export default ApplicationsLoadingPage;
