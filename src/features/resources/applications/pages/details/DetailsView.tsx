import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import LoadingDetailsView from '../../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../../components/display/views/ErrorView';
import { APPLICATION_DETAILS_CONSTANTS } from '../../constants';
import { useApplicationDetails } from '../../hooks';
import ApplicationsDetailsEmpty from './Empty';
import ApplicationDetailsContent from './Content';

const ApplicationDetailsView: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const { details, loading, error } = useApplicationDetails(name);

  if (loading) {
    return <LoadingDetailsView />;
  }

  if (error) {
    return (
      <ErrorView error={error} errorMessagePrefix={APPLICATION_DETAILS_CONSTANTS.MESSAGES.ERROR} />
    );
  }

  if (!details) {
    return <ApplicationsDetailsEmpty />;
  }

  return (
    <div
      style={{
        ...APPLICATION_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER,
        background: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <ApplicationDetailsContent application={details} />
    </div>
  );
});

ApplicationDetailsView.displayName = 'ApplicationDetailsView';

export default ApplicationDetailsView;
