import React from 'react';
import { FancySpinner } from '../../../../components/shared';
import { GROUPERS_PAGE_CONSTANTS } from '../../constants/groupers';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={GROUPERS_PAGE_CONSTANTS.LAYOUT.LOADING_CONTAINER}>
      <FancySpinner label={GROUPERS_PAGE_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
