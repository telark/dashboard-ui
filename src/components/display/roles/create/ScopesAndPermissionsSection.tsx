import React from 'react';
import Section from '../../../shared/Section';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import type { RolesScopesAndPermissionsSectionProps } from '../../../../interfaces/roles';
import RolesScopesAndPermissionsList from './ScopesAndPermissionsList';

const AREAS = RPC.SCOPE.AREAS;
const LEVELS = RPC.SCOPE.LEVELS as readonly ('View' | 'Edit' | 'Delete')[];
const TOOLTIP = RPC.SCOPE.TOOLTIP;

const RolesScopesAndPermissionsSection: React.FC<RolesScopesAndPermissionsSectionProps> = ({ form }) => {
  return (
    <Section
      title={RPC.SCOPE.TITLE}
      subtitle={RPC.SCOPE.SUBTITLE}
      content={
        <RolesScopesAndPermissionsList
          areas={AREAS as any}
          levels={LEVELS as any}
          tooltipMap={TOOLTIP as any}
          rowPaddingPx={4}
          dividerMarginPx={2}
        />
      }
    />
  );
};

export default RolesScopesAndPermissionsSection;


