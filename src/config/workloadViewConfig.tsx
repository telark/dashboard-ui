import { DeploymentUnitOutlined } from '@ant-design/icons';
import {
  AiOutlineTag,
  AiOutlineCluster,
  AiOutlineCalendar,
  AiOutlineLock,
  AiOutlineSwap,
} from 'react-icons/ai';
import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import TimeAgo from '../components/time/TimeAgo';
import { ICONS } from '../constants';
import type { AppWorkload } from '../interfaces/workload';

const WorkloadIcon = ICONS.WORKLOAD;

export const createWorkloadViewConfig = (workload: AppWorkload): ViewDetailsConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: workload.fasid?.sourceName || '—',
        icon: <WorkloadIcon />,
        type: 'text',
      },
      {
        key: 'grouper',
        label: 'Grouper',
        value: workload.fasid?.grouper || '—',
        icon: <AiOutlineCluster />,
        type: 'text',
      },
      {
        key: 'type',
        label: 'Type',
        value: workload.fasid?.sourceType || '—',
        icon: <DeploymentUnitOutlined />,
        type: 'text',
      },
      {
        key: 'creationDate',
        label: 'Creation Date',
        value: <TimeAgo date={workload.fasid?.creationTime || new Date().toISOString()} />,
        icon: <AiOutlineCalendar />,
        type: 'custom',
      },
      {
        key: 'registryType',
        label: 'Registry Type',
        value: workload.cacid?.registry || '—',
        icon: <AiOutlineLock />,
        type: 'text',
      },
      {
        key: 'strategy',
        label: 'Strategy',
        value: workload.cacid?.strategy || '—',
        icon: <AiOutlineSwap />,
        type: 'text',
      },
    ],
  };
};
