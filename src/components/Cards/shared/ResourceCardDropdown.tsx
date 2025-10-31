import React from 'react';
import { Dropdown } from 'antd';
import { MoreOutlined, EyeOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { CARD_CONFIGS, CARD_COLORS, CARD_TRANSITIONS } from '../../../constants';
import { ResourceCardActions, ResourceCardConfig } from '../shared';

interface ResourceCardDropdownProps {
  isSyncingEffective: boolean;
  actions: ResourceCardActions;
  config: ResourceCardConfig;
}

const ResourceCardDropdown: React.FC<ResourceCardDropdownProps> = React.memo(
  ({ isSyncingEffective, actions, config }) => {
    const menuItems = [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: config.viewText,
        onClick: (e: any) => {
          e.domEvent?.stopPropagation();
          actions.onView();
        },
      },
      {
        key: 'sync',
        icon: isSyncingEffective ? <SyncOutlined spin /> : <SyncOutlined />,
        label: isSyncingEffective ? 'Syncing...' : config.syncText,
        onClick: isSyncingEffective
          ? undefined
          : (e: any) => {
              e.domEvent?.stopPropagation();
              actions.onSync();
            },
        disabled: isSyncingEffective,
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: config.deleteText,
        onClick: (e: any) => {
          e.domEvent?.stopPropagation();
          actions.onDelete();
        },
        danger: true,
      },
    ];

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <MoreOutlined
            style={{
              fontSize: CARD_CONFIGS.GROUPER_CARD.ICON_FONT_SIZE,
              color: CARD_COLORS.TEXT.INFO,
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: CARD_TRANSITIONS.ICON,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          />
        </Dropdown>
      </div>
    );
  },
);

ResourceCardDropdown.displayName = 'ResourceCardDropdown';

export default ResourceCardDropdown;
