import { AppstoreOutlined } from '@ant-design/icons';
import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import TimeAgo from '../components/time/TimeAgo';
import { ICONS } from '../constants';

export const createGrouperViewConfig = (
  grouperDetails: any,
  totalResources: number,
): ViewDetailsConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: grouperDetails.name || '—',
        icon: <ICONS.VIEW_FIELD_NAME />,
        type: 'text',
      },
      {
        key: 'creationDate',
        label: 'Creation Date',
        value: <TimeAgo date={grouperDetails.creationTime} />,
        icon: <ICONS.VIEW_FIELD_DATE />,
        type: 'custom',
      },
      {
        key: 'lastModification',
        label: 'Last Modification',
        value: <TimeAgo date={grouperDetails.lastUpdateTime} />,
        icon: <ICONS.VIEW_FIELD_DATE />,
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
