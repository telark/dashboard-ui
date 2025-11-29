import { AiOutlineCheckCircle, AiOutlineTag } from 'react-icons/ai';
import type { Role } from '../models';
import type { DetailsViewConfig } from '../../../../components/display/views/DetailsView';
import { StatusTag } from '../../../../components/display/tags';
import { DEFAULT_COLORS, Icons } from '../../../../constants';

export const createRoleViewConfig = (role: Role): DetailsViewConfig => {
  return {
    fields: [
      {
        key: 'name',
        label: 'Name',
        value: role.name,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'status',
        label: 'Status',
        value: (
          <StatusTag
            label={role.status}
            icon={<AiOutlineCheckCircle />}
            color={role.status === 'Active' ? DEFAULT_COLORS.SUCCESS : '#6b7280'}
          />
        ),
        icon: <AiOutlineCheckCircle />,
        type: 'custom',
      },
      {
        key: 'type',
        label: 'Type',
        value: (
          <StatusTag
            label={role.type}
            icon={<AiOutlineTag />}
            color={role.type === 'built-in' ? '#9333ea' : '#3b82f6'}
          />
        ),
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'creationDate',
        label: 'Created At',
        value: new Date(role.creationDate).toLocaleString('en-US', {
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
