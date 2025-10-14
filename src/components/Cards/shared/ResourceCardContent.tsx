import React from 'react';
import { Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import StatusButton from '../../buttons/StatusButton';
import TimeAgo from '../../time/TimeAgo';
import { Metric } from '../../shared';
import { StatusTag } from '../../tags';
import { UI } from '../../../constants/ui';
import { CapitalizeFirstLetter } from '../../../utils/helpers/format';
import {
  CARD_CONFIGS,
  CARD_COLORS,
  DEFAULT_COLORS,
  CARD_STATES,
} from '../../../constants';
import { ResourceCardDropdown } from '.';
import { ResourceCardData, ResourceCardActions, ResourceCardConfig } from './ResourceCard';

const { Title, Text } = Typography;

interface ResourceCardContentProps {
  data: ResourceCardData;
  statusStyle: {
    color: string;
    borderColor: string;
    icon?: React.ReactElement;
  };
  isSyncingEffective: boolean;
  actions: ResourceCardActions;
  config: ResourceCardConfig;
}

const ResourceCardContent: React.FC<ResourceCardContentProps> = React.memo(
  ({
    data,
    statusStyle,
    isSyncingEffective,
    actions,
    config,
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
              {data.icon}
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
              {CapitalizeFirstLetter(data.name)}
            </Title>
            <Text
              style={{
                color: DEFAULT_COLORS.DEFAULT,
                fontSize: CARD_CONFIGS.GROUPER_CARD.DESCRIPTION_FONT_SIZE,
                marginTop: '-2px',
                display: 'block',
              }}
            >
              {UI.CARD.LAST_UPDATE_PREFIX} <TimeAgo date={data.lastUpdateTime} />
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
            {data.metrics.map((metric, index) => (
              <Metric key={index} label={metric.label} value={metric.value as number} />
            ))}
          </div>

          {/* Tags */}
          {data.tags?.map((tag, index) => (
            <StatusTag
              key={index}
              label={tag.label}
              icon={tag.icon}
              color={tag.color}
            />
          ))}

          {/* Maintenance Tag */}
          {data.maintenance?.status === CARD_STATES.MAINTENANCE.ACTIVE && (
            <StatusTag label={UI.CARD.MAINTENANCE_BADGE} icon={<ToolOutlined />} color="#f59e0b" />
          )}

          {/* Status */}
          <StatusButton
            status={data.status === CARD_STATES.STATUS.ACTIVE ? 'Active' : 'Inactive'}
            icon={statusStyle.icon || <span />}
          />

          {/* Dropdown */}
          <ResourceCardDropdown
            isSyncingEffective={isSyncingEffective}
            actions={actions}
            config={config}
          />
        </div>
      </div>
    );
  },
);

ResourceCardContent.displayName = 'ResourceCardContent';

export default ResourceCardContent;
