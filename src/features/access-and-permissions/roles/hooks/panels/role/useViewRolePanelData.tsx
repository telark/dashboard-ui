import React, { useMemo } from 'react';
import { Tag } from 'antd';
import { DEFAULT_COLORS, EMPTY_VALUE, TAG_CLASS } from '../../../../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import { ActorDisplay } from '../../../../../../components/display/users';
import { useUsernamesByIds } from '../../../../../../hooks/useUsernamesByIds';
import { ValidityDisplay } from '../../../../../../components/display/validity';
import { useCategories } from '../../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../../categories/constants';
import { getCategoryName } from '../../../../categories/utils';
import { useUsers } from '../../../../users/hooks';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import type { Role } from '../../../models';
import type { ViewDetailRow } from '../../../../../../components/display/panels/view/types';

interface UseViewRolePanelDataOptions {
  role: Role | null;
}

interface UseViewRolePanelDataReturn {
  details: ViewDetailRow[];
  name: string;
  description: string;
}

const valueStyle = {
  fontSize: 14,
  fontWeight: 500,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
} as const;

export const useViewRolePanelData = ({
  role,
}: UseViewRolePanelDataOptions): UseViewRolePanelDataReturn => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);
  const { users } = useUsers();

  const createdByUser = useMemo(() => {
    if (!role?.createdBy || !users) return null;
    return users.find((u) => u.id === role.createdBy) ?? null;
  }, [role, users]);

  const lastUpdatedByUser = useMemo(() => {
    if (!role?.lastUpdatedBy || !users) return null;
    return users.find((u) => u.id === role.lastUpdatedBy) ?? null;
  }, [role, users]);

  const actorIds = useMemo(
    () => [role?.createdBy, role?.lastUpdatedBy].filter((id): id is string => Boolean(id)),
    [role],
  );
  const usernamesById = useUsernamesByIds(actorIds, Boolean(role));

  const details = useMemo(() => {
    if (!role) return [];

    const categoryName = getCategoryName(role.categoryRef, categories);
    const isBuiltIn = role.type === RC.TYPE.BUILT_IN;

    return [
      {
        label: RC.LABELS.VIEW_LABELS.STATUS,
        value: <Tag className={TAG_CLASS.MEDIUM}>{role.status}</Tag>,
      },
      {
        label: RC.LABELS.VIEW_LABELS.TYPE,
        value: <Tag className={TAG_CLASS.MEDIUM}>{role.type}</Tag>,
      },
      {
        label: RC.LABELS.VIEW_LABELS.CATEGORY,
        value: <Tag className={TAG_CLASS.MEDIUM}>{categoryName}</Tag>,
      },
      {
        label: RC.LABELS.VIEW_LABELS.VERSION,
        value: <Tag className={TAG_CLASS.MEDIUM}>{role.version || EMPTY_VALUE}</Tag>,
      },
      {
        label: RC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: (
          <span style={valueStyle}>
            {role.creationDate ? <TimeAgo date={role.creationDate} /> : EMPTY_VALUE}
          </span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.LAST_UPDATE,
        value: (
          <span style={valueStyle}>
            {role.lastUpdateDate ? <TimeAgo date={role.lastUpdateDate} /> : EMPTY_VALUE}
          </span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.CREATED_BY,
        value: role.createdBy ? (
          <span style={valueStyle}>
            <ActorDisplay
              actor={role.createdBy}
              user={createdByUser}
              usernamesById={usernamesById}
              size="small"
              showBorder
            />
          </span>
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>{EMPTY_VALUE}</span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.LAST_UPDATED_BY,
        value: role.lastUpdatedBy ? (
          <span style={valueStyle}>
            <ActorDisplay
              actor={role.lastUpdatedBy}
              user={lastUpdatedByUser}
              usernamesById={usernamesById}
              size="small"
              showBorder
            />
          </span>
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>{EMPTY_VALUE}</span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.VALIDITY,
        value: isBuiltIn ? (
          <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>{EMPTY_VALUE}</span>
        ) : (
          <span style={valueStyle}>
            <ValidityDisplay validity={role.validity} record={role} />
          </span>
        ),
      },
    ];
  }, [role, categories, createdByUser, lastUpdatedByUser, usernamesById]);

  return {
    details,
    name: role?.name ?? '',
    description: role?.description ?? '',
  };
};
