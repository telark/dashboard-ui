import { AiOutlineTag } from 'react-icons/ai';
import type { Group } from '../models';
import type { DetailsViewConfig } from '../../../../components/display/views/DetailsView';
import { StatusTag } from '../../../../components/display/tags';
import { ROLES_CONSTANTS as RPC } from '../../roles/constants';
import { Icons } from '../../../../constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import type { Category } from '../../categories/models';

export const createGroupViewConfig = (
  group: Group,
  categories: Category[] = [],
): DetailsViewConfig => {
  const getCategoryName = (categoryId: string): string => {
    if (!categoryId) return '—';
    const category = categories.find((cat) => cat.id === categoryId);
    // Always return the category name, never the ID
    if (!category) {
      // If category not found, return a placeholder instead of the ID
      return '—';
    }
    return category.name;
  };
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: group.name,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'description',
        label: 'Description',
        value: group.description,
        icon: <Icons.ViewFieldDescription />,
        type: 'text',
      },
      {
        key: 'category',
        label: 'Category',
        value: (
          <StatusTag
            label={getCategoryName(group.categoryID)}
            icon={<AiOutlineTag />}
            color={RPC.COLORS.TYPE_CUSTOM_TEXT}
            borderColor={RPC.COLORS.TYPE_CUSTOM_TEXT}
          />
        ),
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'creationDate',
        label: 'Creation Date',
        value: group.creationDate ? (
          <TimeAgo date={group.creationDate} />
        ) : (
          <span style={{ color: '#999' }}>—</span>
        ),
        icon: <Icons.ViewFieldDate />,
        type: 'custom',
      },
    ],
  };
};
