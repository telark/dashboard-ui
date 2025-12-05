import React, { memo } from 'react';
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

interface ScopesAndPermissionsSectionProps {
  isLocked?: boolean;
  onManualChange?: () => void;
}

const RolesScopesAndPermissionsSection: React.FC<ScopesAndPermissionsSectionProps> = memo(
  ({ isLocked = false, onManualChange }) => {
    const props: RolesScopesAndPermissionsListProps = {
      areas: AREAS,
      permissionLevels: PERMISSION_LEVEL_OPTIONS,
      tooltipMap: TOOLTIP,
      rowPaddingPx: 0,
      isLocked,
      onManualChange,
    };

    return (
      <Section
        title={RPC.SCOPE.TITLE}
        subtitle={RPC.SCOPE.SUBTITLE}
        content={
          <>
            {isLocked && (
              <div
                style={{
                  padding: '12px 16px',
                  background: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 14,
                  color: '#92400e',
                  fontWeight: 500,
                }}
              >
                🔒 {RPC.SCOPE.LOCKED_MESSAGE}
              </div>
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
