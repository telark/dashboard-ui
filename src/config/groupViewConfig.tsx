import { AiOutlineTag } from 'react-icons/ai';
import type { Group } from '../interfaces/resources/groups';
import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import { StatusTag } from '../components/tags';
import { ROLES_PAGE_CONSTANTS as RPC } from '../constants/pages/roles';
import { Icons } from '../constants';

export const createGroupViewConfig = (group: Group): ViewDetailsConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: group.name,
        icon: <Icons.VIEW_FIELD_NAME />,
        type: 'text',
      },
      {
        key: 'description',
        label: 'Description',
        value: group.description,
        icon: <Icons.VIEW_FIELD_DESCRIPTION />,
        type: 'text',
      },
      {
        key: 'category',
        label: 'Category',
        value: (
          <StatusTag
            label={group.category}
            icon={<AiOutlineTag />}
            color={RPC.COLORS.TYPE_CUSTOM_TEXT}
            borderColor={RPC.COLORS.TYPE_CUSTOM_TEXT}
          />
        ),
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'createdAt',
        label: 'Creation Date',
        value: new Date(group.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        icon: <Icons.VIEW_FIELD_DATE />,
        type: 'text',
      },
    ],
  };
};
