import React from 'react';
import { FancySpinner } from '../../../components/shared';
import { BRIDGES_PAGE_CONSTANTS } from '../../../constants/pages/bridges';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={BRIDGES_PAGE_CONSTANTS.LAYOUT.LOADING_CONTAINER}>
      <FancySpinner label={BRIDGES_PAGE_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
