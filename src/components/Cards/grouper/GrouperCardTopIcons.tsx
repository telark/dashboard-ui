import React from 'react';
import { Popover } from 'antd';
import { WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import StatusButton from '../../buttons/StatusButton';
import { GROUPER_CARD_STYLES, MAINTENANCE_BADGE_ICON } from '../../../constants/cards/grouper';
import { UI } from '../../../constants/ui';
import { CARD_STATES } from '../../../constants/cards';

interface GrouperCardTopIconsProps {
  status: 'Active' | 'Inactive';
  maintenance: { status: string } | null;
  statusStyle: {
    color: string;
    borderColor: string;
    icon: React.ReactElement;
  };
}

const GrouperCardTopIcons: React.FC<GrouperCardTopIconsProps> = React.memo(({ 
  status, 
  maintenance, 
  statusStyle 
}) => {
  return (
    <div style={GROUPER_CARD_STYLES.topIconsContainer}>
      <StatusButton status={status} icon={statusStyle.icon} />
      {maintenance?.status === CARD_STATES.MAINTENANCE.ACTIVE && (
        <div style={GROUPER_CARD_STYLES.maintenanceBadge}>
          <WarningOutlined
            style={{ fontSize: MAINTENANCE_BADGE_ICON.FONT_SIZE }}
          />
          {UI.CARD.MAINTENANCE_BADGE}
        </div>
      )}
      <Popover content={UI.CARD.INFO_POPOVER} trigger="hover">
        <InfoCircleOutlined style={GROUPER_CARD_STYLES.infoIcon} />
      </Popover>
    </div>
  );
});

GrouperCardTopIcons.displayName = 'GrouperCardTopIcons';

export default GrouperCardTopIcons;
