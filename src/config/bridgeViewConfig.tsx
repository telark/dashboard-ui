import { SyncOutlined, BranchesOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { AiOutlineCluster } from 'react-icons/ai';
import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import TimeAgo from '../components/time/TimeAgo';
import StatusButton from '../components/buttons/StatusButton';
import { Icons } from '../constants';

export const createBridgeViewConfig = (bridgeDetails: any): ViewDetailsConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: bridgeDetails.name || '—',
        icon: <Icons.VIEW_FIELD_NAME />,
        type: 'text',
      },
      {
        key: 'type',
        label: 'Type',
        value: bridgeDetails.type || '—',
        icon: <BranchesOutlined />,
        type: 'text',
      },
      {
        key: 'grouper',
        label: 'Grouper',
        value: bridgeDetails.grouper || '—',
        icon: <AiOutlineCluster />,
        type: 'text',
      },
      {
        key: 'creationDate',
        label: 'Creation Date',
        value: <TimeAgo date={bridgeDetails.creationTime} />,
        icon: <Icons.VIEW_FIELD_DATE />,
        type: 'custom',
      },
      {
        key: 'lastModification',
        label: 'Last Modification',
        value: <TimeAgo date={bridgeDetails.lastUpdateTime} />,
        icon: <Icons.VIEW_FIELD_DATE />,
        type: 'custom',
      },
      {
        key: 'status',
        label: 'Status',
        value: (
          <StatusButton
            status={(bridgeDetails.status as 'Active' | 'Inactive') || 'Inactive'}
            icon={<SyncOutlined />}
          />
        ),
        icon: <SyncOutlined />,
        type: 'custom',
      },
      {
        key: 'ports',
        label: 'Ports',
        value: bridgeDetails.ports?.length || 0,
        icon: <BranchesOutlined />,
        type: 'text',
      },
      {
        key: 'workloads',
        label: 'Workloads',
        value: bridgeDetails.workloads?.length || 0,
        icon: <DeploymentUnitOutlined />,
        type: 'text',
      },
    ],
  };
};
