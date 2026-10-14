import React, { useMemo } from 'react';
import type { ViewPanelTab } from '../../../../../../components/display/panels/view/types';
import RoleProtectionView from '../../../components/display/view/RoleProtectionView';
import RoleScopesView from '../../../components/display/view/RoleScopesView';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import { convertScopesFromAPI } from '../../../utils';
import type { Role } from '../../../models';

export const useRoleViewTabs = (role: Role | null): ViewPanelTab[] =>
  useMemo(() => {
    if (!role) return [];
    const scopes = convertScopesFromAPI(role.scopesAndPermissions ?? []);
    return [
      {
        key: 'scopes',
        label: RC.SCOPE.TITLE,
        count: RC.SCOPE.DEFAULT_AREAS.filter((area) => scopes[area.key]).length,
        content: <RoleScopesView scopes={scopes} />,
      },
      {
        key: 'protection',
        label: RC.PROTECTION.TITLE,
        content: <RoleProtectionView role={role} showTitle={false} />,
      },
    ];
  }, [role]);
