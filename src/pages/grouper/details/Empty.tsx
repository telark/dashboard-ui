import React from 'react';
import { GROUPER_DETAILS_CONSTANTS } from '../../../constants/pages/grouper-details';

const Empty: React.FC = React.memo(() => {
  return (
    <div style={GROUPER_DETAILS_CONSTANTS.STATES.EMPTY_CONTAINER}>
      {GROUPER_DETAILS_CONSTANTS.MESSAGES.EMPTY}
    </div>
  );
});

Empty.displayName = 'Empty';

export default Empty;
