import React, { memo, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingDetailsView from '../../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../../components/display/views/ErrorView';
import { APPLICATION_DETAILS_CONSTANTS } from '../../constants';
import { useApplicationDetails } from '../../hooks';
import ApplicationsDetailsEmpty from './Empty';
import ApplicationDetailsContent from './Content';
import ApplicationPageLayout from '../../components/layout/ApplicationPageLayout';
import { APPLICATIONS_UI } from '../../constants/texts';
import { APP_ROUTES } from '../../../../../constants';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../../../store';
import { fetchApplicationSnapshotsThunk } from '../../store';

const ApplicationDetailsView: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error } = useApplicationDetails(name);

  useEffect(() => {
    if (!details?.name) return;
    // fetch snapshots based on the application ID (exporter-service uses snapshot ID as the scope ID)
    void dispatch(fetchApplicationSnapshotsThunk(details.name));
  }, [details?.name, dispatch]);

  const breadcrumbItems = useMemo(
    () => [
      {
        label: APPLICATIONS_UI.BREADCRUMBS.ROOT,
        onClick: () => navigate(APP_ROUTES.APPLICATIONS),
      },
      { label: details?.displayName || details?.name || name || '' },
    ],
    [details?.displayName, details?.name, name, navigate],
  );

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
    <ApplicationPageLayout
      breadcrumbItems={breadcrumbItems}
      subtitle={APPLICATIONS_UI.DETAIL_PAGE.SUBTITLE}
    >
      <div style={{ marginTop: 24 }}>
        <ApplicationDetailsContent application={details} />
      </div>
    </ApplicationPageLayout>
  );
});

ApplicationDetailsView.displayName = 'ApplicationDetailsView';

export default ApplicationDetailsView;
