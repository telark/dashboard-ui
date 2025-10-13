import React from 'react';
import { GROUPER_DETAILS_CONSTANTS } from '../../../constants/pages/grouper-details';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={GROUPER_DETAILS_CONSTANTS.STATES.LOADING_CONTAINER}>
      {GROUPER_DETAILS_CONSTANTS.MESSAGES.LOADING}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
