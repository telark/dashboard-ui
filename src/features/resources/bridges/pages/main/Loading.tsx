import React from 'react';
import { FancySpinner } from '../../../../../components/shared';
import { BRIDGES_CONSTANTS } from '../../constants';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={BRIDGES_CONSTANTS.LAYOUT.LOADING_CONTAINER}>
      <FancySpinner label={BRIDGES_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
