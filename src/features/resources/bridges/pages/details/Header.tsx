import React from 'react';
import { SyncOutlined, ClusterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import Header from '../../../../../components/display/sections/Header';
import { APP_ROUTES, Icons, UI } from '../../../../../constants';

const BridgeIcon = Icons.Bridge;

interface HeaderProps {
  bridgeDetails: any;
  syncing: boolean;
  isGloballySyncing: boolean;
  onSync: () => void;
}

const BridgeHeader: React.FC<HeaderProps> = React.memo(
  ({ bridgeDetails, syncing, isGloballySyncing, onSync }) => {
    const navigate = useNavigate();
    const grouperName = bridgeDetails?.grouper;

    const breadcrumbs = [
      { label: 'Bridges', to: APP_ROUTES.BRIDGES },
      { label: bridgeDetails.name },
    ];

    const handleViewGrouper = () => {
      if (grouperName) {
        navigate(`${APP_ROUTES.GROUPERS}/${grouperName}/details`);
      }
    };

    return (
      <Header
        breadcrumbs={breadcrumbs}
        subtitle={
          <>
            {UI.HEADER.LAST_UPDATE_PREFIX} <TimeAgo date={bridgeDetails.lastUpdateTime} />
          </>
        }
        primaryText={UI.BUTTONS.SYNC}
        primaryIcon={<SyncOutlined size={16} />}
        primaryLoading={syncing || isGloballySyncing}
        primaryDisabled={syncing || isGloballySyncing}
        onPrimary={onSync}
        secondaryText="View Grouper"
        secondaryIcon={<ClusterOutlined size={16} />}
        onSecondary={grouperName ? handleViewGrouper : undefined}
        icon={<BridgeIcon />}
      />
    );
  },
);

BridgeHeader.displayName = 'BridgeHeader';

export default BridgeHeader;
