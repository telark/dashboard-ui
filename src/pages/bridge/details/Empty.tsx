import React from 'react';
import { BRIDGE_DETAILS_CONSTANTS } from '../../../constants/pages/bridge-details';

const Empty: React.FC = React.memo(() => {
  return (
    <div style={BRIDGE_DETAILS_CONSTANTS.STATES.EMPTY_CONTAINER}>
      {BRIDGE_DETAILS_CONSTANTS.MESSAGES.EMPTY}
    </div>
  );
});

Empty.displayName = 'Empty';

export default Empty;

