import React from 'react';
import { FancySpinner } from '../../../../components/shared';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <FancySpinner label="Loading app details…" showLabel={true} />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
