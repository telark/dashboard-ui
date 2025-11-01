import React from 'react';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import {
  AiOutlineTag,
  AiOutlineSwap,
  AiOutlineCluster,
  AiOutlineCalendar,
  AiOutlineLock,
} from 'react-icons/ai';
import TimeAgo from '../../../time/TimeAgo';
import { AppWorkload } from '../../../../interfaces/workload';
import { Label, Row } from '../../../../components/shared';

interface WorkloadGeneralInfoProps {
  workload: AppWorkload;
}

const WorkloadGeneralInfo: React.FC<WorkloadGeneralInfoProps> = ({ workload }) => (
  <div style={{ padding: '6px 2px' }}>
    <Row
      left={<Label icon={<AiOutlineTag />} text="Name" />}
      right={<span style={{ fontWeight: 700 }}>{workload.fasid?.sourceName || '—'}</span>}
    />

    <Row
      left={<Label icon={<AiOutlineCluster />} text="Grouper" />}
      right={<span style={{ fontWeight: 700 }}>{workload.fasid?.grouper || '—'}</span>}
    />

    <Row
      left={<Label icon={<DeploymentUnitOutlined />} text="Type" />}
      right={<span style={{ fontWeight: 700 }}>{workload.fasid?.sourceType || '—'}</span>}
    />

    <Row
      left={<Label icon={<AiOutlineCalendar />} text="Creation Date" />}
      right={<TimeAgo date={workload.fasid?.creationTime || new Date().toISOString()} />}
    />

    <Row
      left={<Label icon={<AiOutlineLock />} text="Registry Type" />}
      right={<span style={{ fontWeight: 700 }}>{workload.cacid?.registry || '—'}</span>}
    />

    <Row
      left={<Label icon={<AiOutlineSwap />} text="Strategy" />}
      right={<span style={{ fontWeight: 700 }}>{workload.cacid?.strategy || '—'}</span>}
      withDivider={false}
    />
  </div>
);

export default WorkloadGeneralInfo;
