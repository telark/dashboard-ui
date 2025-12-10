import React from 'react';
import { BRIDGE_DETAILS_CONSTANTS } from '../../constants';

const Empty: React.FC = () => {
  return (
    <div style={BRIDGE_DETAILS_CONSTANTS.STATES.EMPTY_CONTAINER}>
      {BRIDGE_DETAILS_CONSTANTS.MESSAGES.EMPTY}
    </div>
  );
};

Empty.displayName = 'Empty';

export default Empty;
