import React from 'react';
import {
  ApartmentOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  BranchesOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import TimeAgo from '../../time/TimeAgo';
import StatusButton from '../../buttons/StatusButton';
import { Label, Row } from '../../../components/shared';

interface BridgeGeneralInfoProps {
  name: string;
  creationTime: string;
  lastUpdateTime: string;
  status: string;
  type: string;
  grouper: string;
  sourceName: string;
  sourceType: string;
  ports?: Array<{ source: number; target: number }>;
  workloads?: Array<{ name: string; type: string }>;
}

const BridgeGeneralInfo: React.FC<BridgeGeneralInfoProps> = ({
  name,
  creationTime,
  lastUpdateTime,
  status,
  type,
  grouper,
  sourceName,
  sourceType,
  ports = [],
  workloads = [],
}) => (
  <div style={{ padding: '6px 2px' }}>
    <Row
      left={<Label icon={<ApartmentOutlined />} text="Name" />}
      right={<span style={{ fontWeight: 700 }}>{name || '—'}</span>}
    />

    <Row
      left={<Label icon={<BranchesOutlined />} text="Type" />}
      right={<span style={{ fontWeight: 700 }}>{type || '—'}</span>}
    />

    <Row
      left={<Label icon={<ApartmentOutlined />} text="Grouper" />}
      right={<span style={{ fontWeight: 700 }}>{grouper || '—'}</span>}
    />

    <Row
      left={<Label icon={<DeploymentUnitOutlined />} text="Source Name" />}
      right={<span style={{ fontWeight: 700 }}>{sourceName || '—'}</span>}
    />

    <Row
      left={<Label icon={<DeploymentUnitOutlined />} text="Source Type" />}
      right={<span style={{ fontWeight: 700 }}>{sourceType || '—'}</span>}
    />

    <Row
      left={<Label icon={<ClockCircleOutlined />} text="Creation Date" />}
      right={<TimeAgo date={creationTime} />}
    />

    <Row
      left={<Label icon={<ClockCircleOutlined />} text="Last Modification" />}
      right={<TimeAgo date={lastUpdateTime} />}
    />

    <Row
      left={<Label icon={<SyncOutlined />} text="Status" />}
      right={
        <StatusButton
          status={(status as 'Active' | 'Inactive') || 'Inactive'}
          icon={<SyncOutlined />}
        />
      }
    />

    <Row
      left={<Label icon={<BranchesOutlined />} text="Ports" />}
      right={<span style={{ fontWeight: 700 }}>{ports?.length || 0}</span>}
    />

    <Row
      left={<Label icon={<DeploymentUnitOutlined />} text="Workloads" />}
      right={<span style={{ fontWeight: 700 }}>{workloads?.length || 0}</span>}
      withDivider={false}
    />
  </div>
);

export default BridgeGeneralInfo;

