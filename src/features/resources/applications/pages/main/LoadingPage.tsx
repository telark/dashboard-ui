import React from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../../constants/shared/pages';
import FullPageLoader from '../../../../../components/display/views/FullPageLoader';
import { APPLICATIONS_CONSTANTS } from '../../constants';

const ApplicationsLoadingPage: React.FC = () => (
  <div
    style={{
      background: DEFAULT_COLORS.BACKGROUND_WHITE,
      minHeight: `calc(100vh - ${PAGE_CONTENT_LAYOUT.HEADER_OFFSET_PX}px)`,
      marginTop: `${PAGE_CONTENT_LAYOUT.HEADER_OFFSET_PX}px`,
    }}
  >
    <FullPageLoader label={APPLICATIONS_CONSTANTS.MESSAGES.LOADING} minHeight="100%" />
  </div>
);

export default ApplicationsLoadingPage;
