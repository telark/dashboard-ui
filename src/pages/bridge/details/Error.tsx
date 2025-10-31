import React from 'react';
import { BRIDGE_DETAILS_CONSTANTS } from '../../../constants/pages/bridge-details';

interface ErrorProps {
  error: string;
}

const Error: React.FC<ErrorProps> = React.memo(({ error }) => {
  return (
    <div style={BRIDGE_DETAILS_CONSTANTS.STATES.ERROR_CONTAINER}>
      {BRIDGE_DETAILS_CONSTANTS.MESSAGES.ERROR} {error}
    </div>
  );
});

Error.displayName = 'Error';

export default Error;
