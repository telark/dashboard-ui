import React from 'react';
import { Typography } from 'antd';
import { AppstoreOutlined, ToolOutlined } from '@ant-design/icons';
import StatusButton from '../../buttons/StatusButton';
import TimeAgo from '../../time/TimeAgo';
import { Metric } from '../../shared';
import { StatusTag } from '../../tags';
import { UI } from '../../../constants/ui';
import { CapitalizeFirstLetter } from '../../../utils/helpers';
import {
  CARD_CONFIGS,
  CARD_COLORS,
  CARD_TRANSITIONS,
  DEFAULT_COLORS,
  CARD_STATES,
} from '../../../constants';
import GrouperCardDropdown from './GrouperCardDropdown';

const { Title, Text } = Typography;

interface GrouperCardContentProps {
  name: string;
  lastUpdateTime: string;
  numberOfWorkloads: number;
  numberOfBridges: number;
  status: string;
  maintenance: { status: string } | null;
  statusStyle: {
    color: string;
    borderColor: string;
    icon: React.ReactElement;
  };
  isSyncingEffective: boolean;
  onView: () => void;
  onSync: () => void;
  onDelete: () => void;
}

const GrouperCardContent: React.FC<GrouperCardContentProps> = React.memo(
  ({
    name,
    lastUpdateTime,
    numberOfWorkloads,
    numberOfBridges,
    status,
    maintenance,
    statusStyle,
    isSyncingEffective,
    onView,
    onSync,
    onDelete,
  }) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Left side - Icon + Name + Maintenance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: CARD_CONFIGS.GROUPER_CARD.HEADER_GAP,
          }}
        >
          <div
            style={{
              backgroundColor: CARD_COLORS.ICON.BACKGROUND,
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: CARD_COLORS.ICON.SHADOW,
            }}
          >
            <span
              style={{ display: 'inline-flex', fontSize: '18px', color: DEFAULT_COLORS.SUCCESS }}
            >
              <AppstoreOutlined />
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Title
              level={5}
              style={{
                margin: 0,
                fontSize: CARD_CONFIGS.GROUPER_CARD.TITLE_FONT_SIZE,
                fontWeight: '600',
              }}
            >
              {CapitalizeFirstLetter(name)}
            </Title>
            <Text
              style={{
                color: DEFAULT_COLORS.DEFAULT,
                fontSize: CARD_CONFIGS.GROUPER_CARD.DESCRIPTION_FONT_SIZE,
                marginTop: '-2px',
                display: 'block',
              }}
            >
              {UI.CARD.LAST_UPDATE_PREFIX} <TimeAgo date={lastUpdateTime} />
            </Text>
          </div>
        </div>

        {/* Right side - Metrics + Maintenance + Status + Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Metrics */}
          <div
            style={{
              display: 'flex',
              gap: CARD_CONFIGS.GROUPER_CARD.METRICS_GAP,
            }}
          >
            <Metric label={UI.CARD.METRICS.WORKLOADS} value={numberOfWorkloads} />
            <Metric label={UI.CARD.METRICS.BRIDGES} value={numberOfBridges} />
          </div>

          {/* Maintenance Tag */}
          {maintenance?.status === CARD_STATES.MAINTENANCE.ACTIVE && (
            <StatusTag label={UI.CARD.MAINTENANCE_BADGE} icon={<ToolOutlined />} color="#f59e0b" />
          )}

          {/* Status */}
          <StatusButton
            status={status === CARD_STATES.STATUS.ACTIVE ? 'Active' : 'Inactive'}
            icon={statusStyle.icon}
          />

          {/* Dropdown */}
          <GrouperCardDropdown
            isSyncingEffective={isSyncingEffective}
            onView={onView}
            onSync={onSync}
            onDelete={onDelete}
          />
        </div>
      </div>
    );
  },
);

GrouperCardContent.displayName = 'GrouperCardContent';

export default GrouperCardContent;
