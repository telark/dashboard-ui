import React from 'react';
import {
  ApartmentOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import TimeAgo from '../../time/TimeAgo';
import { DEFAULT_COLORS } from '../../../constants';
import { GeneralInfoInterface } from '../../../interfaces/common';
import StatusButton from '../../buttons/StatusButton';

interface GrouperGeneralInfoExtension extends GeneralInfoInterface {
  totalResources: number;
}

const Label: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ color: DEFAULT_COLORS.SUCCESS, fontSize: 16, display: 'inline-flex' }}>
      {icon}
    </span>
    <span
      style={{
        color: '#6b7280',
        fontWeight: 700,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}
    >
      {text}
    </span>
  </div>
);

const Row: React.FC<{ left: React.ReactNode; right: React.ReactNode; withDivider?: boolean }> = ({
  left,
  right,
  withDivider = true,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: withDivider ? '1px solid #eef2f6' : 'none',
      minHeight: 40,
    }}
  >
    <div>{left}</div>
    <div style={{ color: '#111827', fontWeight: 600 }}>{right}</div>
  </div>
);

const GrouperGeneralInfo: React.FC<GrouperGeneralInfoExtension> = ({
  name,
  creationTime,
  lastUpdateTime,
  status,
  totalResources,
}) => (
  <div style={{ padding: '6px 2px' }}>
    <Row
      left={<Label icon={<ApartmentOutlined />} text="Name" />}
      right={<span style={{ fontWeight: 700 }}>{name || '—'}</span>}
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
      left={<Label icon={<AppstoreOutlined />} text="Total Resources" />}
      right={<span style={{ fontWeight: 700 }}>{totalResources}</span>}
      withDivider={false}
    />
  </div>
);

export default GrouperGeneralInfo;
