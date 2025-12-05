import React, { memo } from 'react';
import Section from '../../../../../../../components/display/sections/Section';
import { LockBanner } from '../../../../../../../components/display/banners';
import { ROLES_CONSTANTS as RPC, PERMISSION_LEVELS } from '../../../../constants';
import RolesScopesAndPermissionsList from './ScopesAndPermissionsList';
import type {
  RolesScopesAndPermissionsListProps,
  ScopesAndPermissionsSectionProps,
} from '../../../../models';

const AREAS = RPC.SCOPE.DEFAULT_AREAS;
const PERMISSION_LEVEL_OPTIONS = PERMISSION_LEVELS.map((level) => ({
  value: level,
  label: level,
}));
const TOOLTIP = RPC.SCOPE.PERMISSION_LEVEL_TOOLTIP;

const RolesScopesAndPermissionsSection: React.FC<ScopesAndPermissionsSectionProps> = memo(
  ({ isLocked = false, onManualChange, initialValues }) => {
    const props: RolesScopesAndPermissionsListProps = {
      areas: AREAS,
      permissionLevels: PERMISSION_LEVEL_OPTIONS,
      tooltipMap: TOOLTIP,
      rowPaddingPx: 0,
      isLocked,
      onManualChange,
      initialScopes: initialValues?.scopes,
    };

    return (
      <Section
        title={RPC.SCOPE.TITLE}
        subtitle={RPC.SCOPE.SUBTITLE}
        content={
          <>
            {isLocked && (
              <LockBanner
                title="Scopes and Permissions Locked"
                message={RPC.SCOPE.LOCKED_MESSAGE}
                icon={<span style={{ fontSize: 18 }}>🔒</span>}
              />
            )}
            <RolesScopesAndPermissionsList {...props} />
          </>
        }
      />
    );
  },
);

RolesScopesAndPermissionsSection.displayName = 'RolesScopesAndPermissionsSection';

export default RolesScopesAndPermissionsSection;
