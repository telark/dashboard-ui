import React from 'react';
import Section from '../../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RPC, PERMISSION_LEVELS } from '../../../../constants';
import RolesScopesAndPermissionsList from './ScopesAndPermissionsList';
import type { RolesScopesAndPermissionsListProps } from '../../../../models';

const AREAS = RPC.SCOPE.DEFAULT_AREAS;
const PERMISSION_LEVEL_OPTIONS = PERMISSION_LEVELS.map((level) => ({
  value: level,
  label: level,
}));
const TOOLTIP = RPC.SCOPE.PERMISSION_LEVEL_TOOLTIP;

const RolesScopesAndPermissionsSection: React.FC = () => {
  const props: RolesScopesAndPermissionsListProps = {
    areas: AREAS,
    permissionLevels: PERMISSION_LEVEL_OPTIONS,
    tooltipMap: TOOLTIP,
    rowPaddingPx: 0,
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

