import { DeploymentUnitOutlined } from '@ant-design/icons';
import { AiOutlineCluster, AiOutlineLock, AiOutlineSwap } from 'react-icons/ai';
import type { DetailsViewConfig } from '../../../../components/display/views/DetailsView';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import { Icons } from '../../../../constants';
import type { AppWorkload } from '../models';

export const createWorkloadViewConfig = (workload: AppWorkload): DetailsViewConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: workload.fasid?.sourceName || '—',
        icon: <Icons.ViewFieldName />,
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
        icon: <Icons.ViewFieldDate />,
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
