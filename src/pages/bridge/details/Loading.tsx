import React from 'react';
import { BRIDGE_DETAILS_CONSTANTS } from '../../../constants/pages/bridge-details';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={BRIDGE_DETAILS_CONSTANTS.STATES.LOADING_CONTAINER}>
      {BRIDGE_DETAILS_CONSTANTS.MESSAGES.LOADING}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
