import React from 'react';
import { GROUPER_DETAILS_CONSTANTS } from '../../../constants/pages/grouper-details';

interface ErrorProps {
  error: string;
}

const Error: React.FC<ErrorProps> = React.memo(({ error }) => {
  return (
    <div style={GROUPER_DETAILS_CONSTANTS.STATES.ERROR_CONTAINER}>
      {GROUPER_DETAILS_CONSTANTS.MESSAGES.ERROR} {error}
    </div>
  );
});

Error.displayName = 'Error';

export default Error;
