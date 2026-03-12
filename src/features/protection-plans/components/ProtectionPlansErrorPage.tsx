import React from 'react';
import ReachabilityErrorView from '../../../components/display/views/ReachabilityErrorView';

interface ProtectionPlansErrorPageProps {
  error: string;
}

const ProtectionPlansErrorPage: React.FC<ProtectionPlansErrorPageProps> = ({ error }) => {
  return (
    <ReachabilityErrorView
      isInCooldown={false}
      cooldownTime={0}
      retryCount={0}
      nextRetryIn={0}
      onCancel={() => undefined}
      errorDetails={error}
    />
  );
};

export default ProtectionPlansErrorPage;

