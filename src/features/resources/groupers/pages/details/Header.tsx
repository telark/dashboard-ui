import React from 'react';
import { SyncOutlined } from '@ant-design/icons';
import TimeAgo from '../../../../../components/time/TimeAgo';
import Header from '../../../../../components/display/shared/sections/Header';
import { APP_ROUTES, Icons, UI } from '../../../../../constants';

const GrouperIcon = Icons.Grouper;

interface HeaderProps {
  grouperDetails: any;
  isMaintenanceModeActive: boolean;
  syncing: boolean;
  isGloballySyncing: boolean;
  onSync: () => void;
}

const GrouperHeader: React.FC<HeaderProps> = React.memo(
  ({ grouperDetails, syncing, isGloballySyncing, onSync }) => {
    const breadcrumbs = [
      { label: 'Groupers', to: APP_ROUTES.GROUPERS },
      { label: grouperDetails.name },
    ];

    return (
      <Header
        breadcrumbs={breadcrumbs}
        subtitle={
          <>
            {UI.HEADER.LAST_UPDATE_PREFIX} <TimeAgo date={grouperDetails.lastUpdateTime} />
          </>
        }
        primaryText={UI.BUTTONS.SYNC}
        primaryIcon={<SyncOutlined size={16} />}
        primaryLoading={syncing || isGloballySyncing}
        primaryDisabled={syncing || isGloballySyncing}
        onPrimary={onSync}
        icon={<GrouperIcon />}
      />
    );
  },
);

GrouperHeader.displayName = 'GrouperHeader';

export default GrouperHeader;
