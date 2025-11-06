import { AppstoreOutlined } from '@ant-design/icons';
import { AiOutlineCalendar } from 'react-icons/ai';

import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import TimeAgo from '../components/time/TimeAgo';
import { ICONS } from '../constants';

const GrouperIcon = ICONS.GROUPER;

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
        icon: <GrouperIcon />,
        type: 'text',
      },
      {
        key: 'creationDate',
        label: 'Creation Date',
        value: <TimeAgo date={grouperDetails.creationTime} />,
        icon: <AiOutlineCalendar />,
        type: 'custom',
      },
      {
        key: 'lastModification',
        label: 'Last Modification',
        value: <TimeAgo date={grouperDetails.lastUpdateTime} />,
        icon: <AiOutlineCalendar />,
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
