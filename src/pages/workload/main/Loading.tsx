import React from 'react';
import { FancySpinner } from '../../../components/shared';
import { WORKLOADS_PAGE_CONSTANTS } from '../../../constants/pages/workloads';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.LOADING_CONTAINER}>
      <FancySpinner 
        label={WORKLOADS_PAGE_CONSTANTS.MESSAGES.LOADING} 
        showLabel={true} 
      />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
