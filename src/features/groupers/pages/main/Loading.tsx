import React from 'react';
import { FancySpinner } from '../../../../components/shared';
import { GROUPERS_CONSTANTS } from '../../constants';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={GROUPERS_CONSTANTS.LAYOUT.LOADING_CONTAINER}>
      <FancySpinner label={GROUPERS_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
