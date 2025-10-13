import React from 'react';
import { Typography } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { CapitalizeFirstLetter } from '../../../utils/helpers';
import { GROUPER_CARD_STYLES } from '../../../constants/cards/grouper';
import { UI } from '../../../constants/ui';
import TimeAgo from '../../time/TimeAgo';

const { Title, Text } = Typography;

interface GrouperCardHeaderProps {
  name: string;
  lastUpdateTime: string;
}

const GrouperCardHeader: React.FC<GrouperCardHeaderProps> = React.memo(({ name, lastUpdateTime }) => {
  return (
    <div style={GROUPER_CARD_STYLES.header}>
      <div style={GROUPER_CARD_STYLES.iconContainer}>
        <span style={GROUPER_CARD_STYLES.iconSpan}>
          <AppstoreOutlined />
        </span>
      </div>
      <div>
        <Title level={5} style={GROUPER_CARD_STYLES.title}>
          {CapitalizeFirstLetter(name)}
        </Title>
        <Text style={GROUPER_CARD_STYLES.description}>
          {UI.CARD.LAST_UPDATE_PREFIX} <TimeAgo date={lastUpdateTime} />
        </Text>
      </div>
    </div>
  );
});

GrouperCardHeader.displayName = 'GrouperCardHeader';

export default GrouperCardHeader;
