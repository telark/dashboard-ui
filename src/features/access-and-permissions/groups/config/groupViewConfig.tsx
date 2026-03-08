import { AiOutlineTag } from 'react-icons/ai';
import type { Group } from '../models';
import type { DetailsViewConfig } from '../../../../components/display/views/DetailsView';
import { StatusTag } from '../../../../components/display/tags';
import { DEFAULT_COLORS } from '../../../../constants';
import { Icons } from '../../../../constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import type { Category } from '../../categories/models';
import { getCategoryName } from '../../categories/utils';
import { GROUPS_CONSTANTS as GC } from '../constants';

export const createGroupViewConfig = (
  group: Group,
  categories: Category[] = [],
): DetailsViewConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: GC.LABELS.VIEW_LABELS.NAME,
        value: group.name,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'description',
        label: GC.LABELS.VIEW_LABELS.DESCRIPTION,
        value: group.description,
        icon: <Icons.ViewFieldDescription />,
        type: 'text',
      },
      {
        key: 'category',
        label: GC.LABELS.VIEW_LABELS.CATEGORY,
        value: (
          <StatusTag
            label={getCategoryName(group.categoryID, categories)}
            icon={<AiOutlineTag />}
            color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
            borderColor={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
          />
        ),
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'creationDate',
        label: GC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: group.creationDate ? (
          <TimeAgo date={group.creationDate} />
        ) : (
          <span style={{ color: DEFAULT_COLORS.DEFAULT }}>—</span>
        ),
        icon: <Icons.ViewFieldDate />,
        type: 'custom',
      },
    ],
  };
};
