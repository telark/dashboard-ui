import React from 'react';
import Section from '../shared/Section';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import RolesScopesAndPermissionsList from './ScopesAndPermissionsList';

const AREAS = RPC.SCOPE.AREAS;
const PERMISSIONS = RPC.SCOPE.PERMISSIONS;
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
