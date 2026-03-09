import React, { useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../../components/display/table/RowTag';
import { useCategories } from '../../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../../categories/constants';
import { getCategoryName } from '../../../../categories/utils';
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

export const useViewRolePanelData = ({
  role,
}: UseViewRolePanelDataOptions): UseViewRolePanelDataReturn => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);

  const details = useMemo(() => {
    if (!role) return [];

    const categoryName = getCategoryName(role.categoryID, categories);
    const tagStyle = {
      background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
      color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
      fontSize: 12 as const,
    };

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
        label: RC.LABELS.VIEW_LABELS.CREATION_DATE,
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {role.creationDate ? <TimeAgo date={role.creationDate} /> : '—'}
          </span>
        ),
      },
      {
        label: RC.LABELS.VIEW_LABELS.LAST_UPDATE,
        value: (
          <span style={{ fontSize: 14, fontWeight: 500, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            {role.lastUpdateDate ? <TimeAgo date={role.lastUpdateDate} /> : '—'}
          </span>
        ),
      },
    ];
  }, [role, categories]);

  return {
    details,
    name: role?.name ?? '',
    description: role?.description ?? '',
  };
};
