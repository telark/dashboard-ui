import React, { CSSProperties } from 'react';
import { FancySpinner } from '../../../shared';
import { SHARED_PAGE_CONSTANTS } from '../../../../constants/shared/pages';

interface LoadingViewProps {
  label: string;
  containerStyle?: CSSProperties;
}

const LoadingView: React.FC<LoadingViewProps> = React.memo(({ label, containerStyle }) => {
  return (
    <div style={{ ...SHARED_PAGE_CONSTANTS.LAYOUT.LOADING_CONTAINER, ...containerStyle }}>
      <FancySpinner label={label} showLabel={true} />
    </div>
  );
});

LoadingView.displayName = 'LoadingView';

export default LoadingView;

