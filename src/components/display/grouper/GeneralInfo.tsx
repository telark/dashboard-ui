import React from 'react';
import { SyncOutlined, AppstoreOutlined } from '@ant-design/icons';
import { AiOutlineTag, AiOutlineCalendar } from 'react-icons/ai';
import TimeAgo from '../../time/TimeAgo';
import { GeneralInfoInterface } from '../../../interfaces/shared';
import StatusButton from '../../buttons/StatusButton';
import { Label, Row } from '../../../components/shared';

interface GrouperGeneralInfoExtension extends GeneralInfoInterface {
  totalResources: number;
}

const GrouperGeneralInfo: React.FC<GrouperGeneralInfoExtension> = ({
  name,
  creationTime,
  lastUpdateTime,
  totalResources,
}) => (
  <div style={{ padding: '6px 2px' }}>
    <Row
      left={<Label icon={<AiOutlineTag />} text="Name" />}
      right={<span style={{ fontWeight: 700 }}>{name || '—'}</span>}
    />

    <Row
      left={<Label icon={<AiOutlineCalendar />} text="Creation Date" />}
      right={<TimeAgo date={creationTime} />}
    />

    <Row
      left={<Label icon={<AiOutlineCalendar />} text="Last Modification" />}
      right={<TimeAgo date={lastUpdateTime} />}
    />

    <Row
      left={<Label icon={<AppstoreOutlined />} text="Total Resources" />}
      right={<span style={{ fontWeight: 700 }}>{totalResources}</span>}
      withDivider={false}
    />
  </div>
);

export default GrouperGeneralInfo;
