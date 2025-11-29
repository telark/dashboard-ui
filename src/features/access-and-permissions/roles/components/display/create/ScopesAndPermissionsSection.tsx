import React from 'react';
import Section from '../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RPC, SCOPE_PERMISSIONS } from '../../../constants';
import RolesScopesAndPermissionsList from './ScopesAndPermissionsList';
import type { RolesScopesAndPermissionsListProps } from '../../../models';

const AREAS = RPC.SCOPE.DEFAULT_AREAS;
const PERMISSIONS = SCOPE_PERMISSIONS;
const TOOLTIP = RPC.SCOPE.TOOLTIP;

const RolesScopesAndPermissionsSection: React.FC = () => {
  const props: RolesScopesAndPermissionsListProps = {
    areas: AREAS,
    permissions: PERMISSIONS,
    tooltipMap: TOOLTIP,
    rowPaddingPx: 0,
    dividerMarginPx: 0,
  };

  return (
    <Section
      title={RPC.SCOPE.TITLE}
      subtitle={RPC.SCOPE.SUBTITLE}
      content={<RolesScopesAndPermissionsList {...props} />}
    />
  );
};

export default RolesScopesAndPermissionsSection;
