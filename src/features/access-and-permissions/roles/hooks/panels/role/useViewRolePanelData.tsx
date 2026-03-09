import React, { useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../../components/display/table/RowTag';
import { UserDisplay } from '../../../../../../components/display/users';
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
  color: DEFAULT_COLORS.TEXT_PRIMARY,
} as const;

export const useViewRolePanelData = ({
  role,
}: UseViewRolePanelDataOptions): UseViewRolePanelDataReturn => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);
  const { users } = useUsers();

  const createdByUser = useMemo(() => {
    if (!role?.createdBy || !users) return null;
    return users.find((u) => u.id === role.createdBy) ?? null;
  }, [role?.createdBy, users]);

  const lastUpdatedByUser = useMemo(() => {
    if (!role?.lastUpdatedBy || !users) return null;
    return users.find((u) => u.id === role.lastUpdatedBy) ?? null;
  }, [role?.lastUpdatedBy, users]);

  const details = useMemo(() => {
    if (!role) return [];

    const categoryName = getCategoryName(role.categoryID, categories);
    const tagStyle = {
      background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
      color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
      fontSize: 12 as const,
    };
    const isBuiltIn = role.type === RC.TYPE.BUILT_IN;

    return [
      {
        label: RC.LABELS.VIEW_LABELS.STATUS,
        value: (
          <RowTag
            text={role.status}
            background={tagStyle.background}
            color={tagStyle.color}
            fontSize={tagStyle.fontSize}
          />
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.TYPE,
        value: (
          <RowTag
            text={role.type}
            background={tagStyle.background}
            color={tagStyle.color}
            fontSize={tagStyle.fontSize}
          />
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.CATEGORY,
        value: (
          <RowTag
            text={categoryName}
            background={tagStyle.background}
            color={tagStyle.color}
            fontSize={tagStyle.fontSize}
          />
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.VERSION,
        value: (
          <RowTag
            text={role.version || '—'}
            background={tagStyle.background}
            color={tagStyle.color}
            fontSize={tagStyle.fontSize}
          />
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: (
          <span style={valueStyle}>
            {role.creationDate ? <TimeAgo date={role.creationDate} /> : '—'}
          </span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.LAST_UPDATE,
        value: (
          <span style={valueStyle}>
            {role.lastUpdateDate ? <TimeAgo date={role.lastUpdateDate} /> : '—'}
          </span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.CREATED_BY,
        value: createdByUser ? (
          <UserDisplay user={createdByUser} size="small" showBorder />
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>—</span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.LAST_UPDATED_BY,
        value: lastUpdatedByUser ? (
          <UserDisplay user={lastUpdatedByUser} size="small" showBorder />
        ) : (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>—</span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.VALIDITY,
        value: isBuiltIn ? (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>—</span>
        ) : (
          <span style={valueStyle}>
            <ValidityDisplay validity={role.validity} record={role} />
          </span>
        ),
      },
    ];
  }, [role, categories, createdByUser, lastUpdatedByUser]);

  return {
    details,
    name: role?.name ?? '',
    description: role?.description ?? '',
  };
};
