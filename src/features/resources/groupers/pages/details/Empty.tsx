import React from 'react';
import { GROUPER_DETAILS_CONSTANTS } from '../../constants';

const GrouperDetailsEmpty: React.FC = () => {
  return (
    <div style={GROUPER_DETAILS_CONSTANTS.STATES.EMPTY_CONTAINER}>
      {GROUPER_DETAILS_CONSTANTS.MESSAGES.EMPTY}
    </div>
  );
};

GrouperDetailsEmpty.displayName = 'GrouperDetailsEmpty';

export default GrouperDetailsEmpty;
