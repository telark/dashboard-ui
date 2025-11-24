import React, { CSSProperties } from 'react';
import { SHARED_DETAILS_CONSTANTS } from '../../../../constants/shared/details';

interface ErrorViewProps {
  error: string;
  errorMessagePrefix: string;
  containerStyle?: CSSProperties;
}

const ErrorView: React.FC<ErrorViewProps> = React.memo(
  ({ error, errorMessagePrefix, containerStyle }) => {
    return (
      <div style={{ ...SHARED_DETAILS_CONSTANTS.STATES.ERROR_CONTAINER, ...containerStyle }}>
        {errorMessagePrefix} {error}
      </div>
    );
  },
);

ErrorView.displayName = 'ErrorView';

export default ErrorView;
