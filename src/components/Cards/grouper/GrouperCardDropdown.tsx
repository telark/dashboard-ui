import React from 'react';
import { Dropdown } from 'antd';
import { MoreOutlined, EyeOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import { CARD_CONFIGS, CARD_COLORS, CARD_TRANSITIONS } from '../../../constants';

interface GrouperCardDropdownProps {
  isSyncingEffective: boolean;
  onView: () => void;
  onSync: () => void;
  onDelete: () => void;
}

const GrouperCardDropdown: React.FC<GrouperCardDropdownProps> = React.memo(({
  isSyncingEffective,
  onView,
  onSync,
  onDelete,
}) => {
  const menuItems = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Details',
      onClick: (e: any) => {
        e.domEvent?.stopPropagation();
        onView();
      },
    },
    {
      key: 'sync',
      icon: isSyncingEffective ? <SyncOutlined spin /> : <SyncOutlined />,
      label: isSyncingEffective ? 'Syncing...' : 'Sync Grouper',
      onClick: isSyncingEffective ? undefined : (e: any) => {
        e.domEvent?.stopPropagation();
        onSync();
      },
      disabled: isSyncingEffective,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete Grouper',
      onClick: (e: any) => {
        e.domEvent?.stopPropagation();
        onDelete();
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
});

GrouperCardDropdown.displayName = 'GrouperCardDropdown';

export default GrouperCardDropdown;
