import React from 'react';
import LoadingView from './LoadingView';

const LoadingDetailsView: React.FC = () => {
  return <LoadingView label="Loading details…" />;
};

LoadingDetailsView.displayName = 'Loading';

export default LoadingDetailsView;
