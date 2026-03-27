import React from 'react';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import Header from '../../../../../components/display/sections/Header';
import { APP_ROUTES, Icons, UI, MENU_LABELS } from '../../../../../constants';

const ApplicationIcon = Icons.Application;

interface ApplicationHeaderProps {
  name: string;
  displayName?: string;
  lastUpdated?: string;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = React.memo(
  ({ name, displayName, lastUpdated }) => {
    const breadcrumbs = [{ label: MENU_LABELS.APPLICATIONS, to: APP_ROUTES.APPLICATIONS }, { label: name }];

    return (
      <Header
        breadcrumbs={breadcrumbs}
        title={displayName || name}
        subtitle={
          lastUpdated ? (
            <>
              {UI.HEADER.LAST_UPDATE_PREFIX} <TimeAgo date={lastUpdated} />
            </>
          ) : null
        }
        icon={<ApplicationIcon />}
      />
    );
  },
);

ApplicationHeader.displayName = 'ApplicationHeader';

export default ApplicationHeader;

