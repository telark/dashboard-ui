import React from 'react';
import { FancySpinner } from '../../animation';

const LoadingDetailsView: React.FC = () => {
  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <FancySpinner label="Loading details…" showLabel={true} />
    </div>
  );
};

LoadingDetailsView.displayName = 'Loading';

export default LoadingDetailsView;
