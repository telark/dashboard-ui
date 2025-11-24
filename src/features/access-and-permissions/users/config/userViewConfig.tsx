import { AiOutlineTag } from 'react-icons/ai';
import type { User } from '../models';
import type { ViewDetailsConfig } from '../../../../components/display/shared/views/ViewDetails';
import { StatusTag } from '../../../../components/tags';
import { ROLES_CONSTANTS as RPC } from '../../roles/constants';
import { Icons } from '../../../../constants';

export const createUserViewConfig = (user: User): ViewDetailsConfig => {
  return {
    fields: [
      {
        key: 'username',
        label: 'Username',
        value: user.username,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'fullname',
        label: 'Full Name',
        value: user.fullname,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'email',
        label: 'Email',
        value: user.email,
        icon: <Icons.ViewFieldDescription />,
        type: 'text',
      },
      {
        key: 'roleID',
        label: 'Role ID',
        value: (
          <StatusTag
            label={user.roleID}
            icon={<AiOutlineTag />}
            color={RPC.COLORS.TYPE_CUSTOM_TEXT}
            borderColor={RPC.COLORS.TYPE_CUSTOM_TEXT}
          />
        ),
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'groupID',
        label: 'Group ID',
        value: user.groupID,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'status',
        label: 'Status',
        value: (
          <StatusTag
            label={user.status.phase}
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
        value: new Date(user.creationDate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        icon: <Icons.ViewFieldDate />,
        type: 'text',
      },
    ],
  };
};
