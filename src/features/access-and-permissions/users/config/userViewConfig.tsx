import React from 'react';
import { AiOutlineTag } from 'react-icons/ai';
import type { User } from '../models';
import type { DetailsViewConfig } from '../../../../components/display/views/DetailsView';
import { StatusTag } from '../../../../components/display/tags';
import { DEFAULT_COLORS, Icons } from '../../../../constants';
import { USERS_CONSTANTS as UC } from '../constants';

export const createUserViewConfig = (user: User): DetailsViewConfig => {
  const rolesTags =
    user.assignedRolesIDs?.length > 0
      ? user.assignedRolesIDs.map((id) => (
          <StatusTag
            key={id}
            label={id}
            icon={<AiOutlineTag />}
            color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
            borderColor={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
          />
        ))
      : '—';

  const groupsTags = user.assignedGroupsIDs?.length > 0 ? user.assignedGroupsIDs.join(', ') : '—';

  return {
    fields: [
      {
        key: 'username',
        label: UC.LABELS.VIEW_LABELS.USERNAME,
        value: user.username,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'fullname',
        label: UC.LABELS.VIEW_LABELS.FULLNAME,
        value: user.fullname,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'email',
        label: UC.LABELS.VIEW_LABELS.EMAIL,
        value: user.email,
        icon: <Icons.ViewFieldDescription />,
        type: 'text',
      },
      {
        key: 'assignedRolesIDs',
        label: UC.LABELS.VIEW_LABELS.ROLES,
        value: <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{rolesTags}</div>,
        icon: <AiOutlineTag />,
        type: 'custom',
      },
      {
        key: 'assignedGroupsIDs',
        label: UC.LABELS.VIEW_LABELS.GROUPS,
        value: groupsTags,
        icon: <Icons.ViewFieldName />,
        type: 'text',
      },
      {
        key: 'status',
        label: UC.LABELS.VIEW_LABELS.STATUS,
        value: (
          <StatusTag
            label={user.status.phase}
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
        label: UC.LABELS.VIEW_LABELS.CREATION_DATE,
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
