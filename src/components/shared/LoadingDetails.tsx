import React from 'react';
import FancySpinner from './FancySpinner';

const Loading: React.FC = React.memo(() => {
  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <FancySpinner label="Loading details…" showLabel={true} />
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
