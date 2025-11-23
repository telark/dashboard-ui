import React from 'react';
import { FancySpinner } from '../../../../components/shared';
import { WORKLOADS_CONSTANTS } from '../../constants';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={WORKLOADS_CONSTANTS.LAYOUT.LOADING_CONTAINER}>
      <FancySpinner label={WORKLOADS_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
