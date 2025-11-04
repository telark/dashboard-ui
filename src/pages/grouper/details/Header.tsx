import React from 'react';
import { Button } from 'antd';
import { SyncOutlined, ToolOutlined } from '@ant-design/icons';
import { AiOutlineCluster, AiOutlineCheckCircle } from 'react-icons/ai';
import StatusButton from '../../../components/buttons/StatusButton';
import TimeAgo from '../../../components/time/TimeAgo';
import { FancySpinner } from '../../../components/shared';
import { StatusTag } from '../../../components/tags';
import { UI } from '../../../constants/layout/ui';
import { GROUPER_DETAILS_CONSTANTS } from '../../../constants/pages/grouper-details';

interface HeaderProps {
  grouperDetails: any;
  isMaintenanceModeActive: boolean;
  syncing: boolean;
  isGloballySyncing: boolean;
  onSync: () => void;
}

const Header: React.FC<HeaderProps> = React.memo(
  ({ grouperDetails, isMaintenanceModeActive, syncing, isGloballySyncing, onSync }) => {
    return (
      <div style={GROUPER_DETAILS_CONSTANTS.LAYOUT.HEADER_CONTAINER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={GROUPER_DETAILS_CONSTANTS.HEADER.ICON_CONTAINER}>
            <AiOutlineCluster />
          </div>

          <div>
            <div style={GROUPER_DETAILS_CONSTANTS.HEADER.TITLE_CONTAINER}>
              <div style={GROUPER_DETAILS_CONSTANTS.HEADER.TITLE}>{grouperDetails.name}</div>
              <StatusButton
                status={(grouperDetails.status as 'Active' | 'Inactive') || 'Inactive'}
                icon={<AiOutlineCheckCircle />}
              />
              {isMaintenanceModeActive && (
                <StatusTag label="Maintenance" icon={<ToolOutlined />} color="#f59e0b" />
              )}
            </div>
            <div style={GROUPER_DETAILS_CONSTANTS.HEADER.SUBTITLE}>
              {UI.HEADER.LAST_UPDATE_PREFIX} <TimeAgo date={grouperDetails.lastUpdateTime} />
            </div>
          </div>
        </div>

        <div style={GROUPER_DETAILS_CONSTANTS.HEADER.BUTTON_CONTAINER}>
          <Button
            size="middle"
            onClick={syncing || isGloballySyncing ? undefined : onSync}
            disabled={syncing || isGloballySyncing}
          >
            {syncing ? (
              <FancySpinner
                showLabel={GROUPER_DETAILS_CONSTANTS.FANCY_SPINNER.SHOW_LABEL}
                size={GROUPER_DETAILS_CONSTANTS.FANCY_SPINNER.SIZE}
                ringThickness={GROUPER_DETAILS_CONSTANTS.FANCY_SPINNER.RING_THICKNESS}
              />
            ) : (
              <span style={GROUPER_DETAILS_CONSTANTS.HEADER.SYNC_BUTTON_CONTENT}>
                <SyncOutlined /> {UI.BUTTONS.SYNC}
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
