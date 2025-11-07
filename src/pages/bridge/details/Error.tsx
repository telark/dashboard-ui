import React from 'react';
import { BRIDGE_DETAILS_CONSTANTS } from '../../../constants/pages/bridge-details';

interface BridgeErrorProps {
  error: string;
}

const BridgeError: React.FC<BridgeErrorProps> = React.memo(({ error }) => {
  return (
    <div style={BRIDGE_DETAILS_CONSTANTS.STATES.ERROR_CONTAINER}>
      {BRIDGE_DETAILS_CONSTANTS.MESSAGES.ERROR} {error}
    </div>
  );
});

BridgeError.displayName = 'BridgeError';

export default BridgeError;
