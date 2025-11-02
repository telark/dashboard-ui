import React from 'react';
import Section from '../../shared/Section';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../constants/pages/roles';
import type { RolesScopePermissionsSectionProps } from '../../../interfaces/roles';
import RolesScopeContent from './RolesScopeContent';

const AREAS = RPC.SCOPE.AREAS;
const LEVELS = RPC.SCOPE.LEVELS as readonly ('View' | 'Edit' | 'Delete')[];
const TOOLTIP = RPC.SCOPE.TOOLTIP;

const RolesScopePermissionsSection: React.FC<RolesScopePermissionsSectionProps> = ({ form }) => {
  return (
    <Section
      title={RPC.SCOPE.TITLE}
      subtitle={RPC.SCOPE.SUBTITLE}
      content={
        <RolesScopeContent
          form={form}
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

export default RolesScopePermissionsSection;


