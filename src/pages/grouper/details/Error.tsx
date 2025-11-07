import React from 'react';
import { GROUPER_DETAILS_CONSTANTS } from '../../../constants/pages/grouper-details';

interface GrouperDetailsErrorProps {
  error: string;
}

const GrouperDetailsError: React.FC<GrouperDetailsErrorProps> = React.memo(({ error }) => {
  return (
    <div style={GROUPER_DETAILS_CONSTANTS.STATES.ERROR_CONTAINER}>
      {GROUPER_DETAILS_CONSTANTS.MESSAGES.ERROR} {error}
    </div>
  );
});

GrouperDetailsError.displayName = 'GrouperDetailsError';

export default GrouperDetailsError;
