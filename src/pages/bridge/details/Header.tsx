import React from 'react';
import { Button } from 'antd';
import { AiOutlineCheckCircle, AiOutlineSync } from 'react-icons/ai';
import StatusButton from '../../../components/buttons/StatusButton';
import TimeAgo from '../../../components/time/TimeAgo';
import { FancySpinner } from '../../../components/shared';
import { UI, ICONS } from '../../../constants';
import { BRIDGE_DETAILS_CONSTANTS } from '../../../constants/pages/bridge-details';

const BridgeIcon = ICONS.BRIDGE;

interface HeaderProps {
  bridgeDetails: any;
  syncing: boolean;
  isGloballySyncing: boolean;
  onSync: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(
  ({ bridgeDetails, syncing, isGloballySyncing, onSync }) => {
    return (
      <div style={BRIDGE_DETAILS_CONSTANTS.LAYOUT.HEADER_CONTAINER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={BRIDGE_DETAILS_CONSTANTS.HEADER.ICON_CONTAINER}>
            <BridgeIcon />
          </div>

          <div>
            <div style={BRIDGE_DETAILS_CONSTANTS.HEADER.TITLE_CONTAINER}>
              <div style={BRIDGE_DETAILS_CONSTANTS.HEADER.TITLE}>{bridgeDetails.name}</div>
              <StatusButton
                status={(bridgeDetails.status as 'Active' | 'Inactive') || 'Inactive'}
                icon={<AiOutlineCheckCircle />}
              />
            </div>
            <div style={BRIDGE_DETAILS_CONSTANTS.HEADER.SUBTITLE}>
              {UI.HEADER.LAST_UPDATE_PREFIX} <TimeAgo date={bridgeDetails.lastUpdateTime} />
            </div>
          </div>
        </div>

        <div style={BRIDGE_DETAILS_CONSTANTS.HEADER.BUTTON_CONTAINER}>
          <Button
            size="middle"
            onClick={syncing || isGloballySyncing ? undefined : onSync}
            disabled={syncing || isGloballySyncing}
          >
            {syncing ? (
              <FancySpinner
                showLabel={BRIDGE_DETAILS_CONSTANTS.FANCY_SPINNER.SHOW_LABEL}
                size={BRIDGE_DETAILS_CONSTANTS.FANCY_SPINNER.SIZE}
                ringThickness={BRIDGE_DETAILS_CONSTANTS.FANCY_SPINNER.RING_THICKNESS}
              />
            ) : (
              <span style={BRIDGE_DETAILS_CONSTANTS.HEADER.SYNC_BUTTON_CONTENT}>
                <AiOutlineSync /> {UI.BUTTONS.SYNC}
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  },
);

Header.displayName = 'Header';

export default Header;
