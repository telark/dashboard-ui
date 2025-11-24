import { AppstoreOutlined } from '@ant-design/icons';
import type { DetailsViewConfig } from '../../../../components/display/views/DetailsView';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import { Icons } from '../../../../constants';

export const createGrouperViewConfig = (
  grouperDetails: any,
  totalResources: number,
): DetailsViewConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: grouperDetails.name || '—',
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'creationDate',
        label: 'Creation Date',
        value: <TimeAgo date={grouperDetails.creationTime} />,
        icon: <Icons.ViewFieldDate />,
        type: 'custom',
      },
      {
        key: 'lastModification',
        label: 'Last Modification',
        value: <TimeAgo date={grouperDetails.lastUpdateTime} />,
        icon: <Icons.ViewFieldDate />,
        type: 'custom',
      },
      {
        key: 'totalResources',
        label: 'Total Resources',
        value: totalResources,
        icon: <AppstoreOutlined />,
        type: 'text',
      },
    ],
  };
};
