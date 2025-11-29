import React from 'react';
import Section from '../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RPC, SCOPE_PERMISSIONS } from '../../../constants';
import RolesScopesAndPermissionsList from './ScopesAndPermissionsList';

const AREAS = RPC.SCOPE.DEFAULT_AREAS;
const PERMISSIONS = SCOPE_PERMISSIONS;
const TOOLTIP = RPC.SCOPE.TOOLTIP;

const RolesScopesAndPermissionsSection: React.FC = () => {
  return (
    <Section
      title={RPC.SCOPE.TITLE}
      subtitle={RPC.SCOPE.SUBTITLE}
      content={
        <RolesScopesAndPermissionsList
          areas={AREAS as any}
          permissions={PERMISSIONS as any}
          tooltipMap={TOOLTIP as any}
          rowPaddingPx={0}
          dividerMarginPx={0}
        />
      }
    />
  );
};

export default RolesScopesAndPermissionsSection;
