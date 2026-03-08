import React from 'react';
import type { RolesScopesAndPermissionsListProps } from '../../../../models';
import ScopeRow from './ScopeRow';

const RolesScopesAndPermissionsList: React.FC<RolesScopesAndPermissionsListProps> = ({
  areas,
  permissionLevels,
  tooltipMap,
  rowPaddingPx = 4,
  isLocked = false,
  onManualChange,
  initialScopes,
}) => {
  return (
    <>
      {areas.map((area: { key: string; label: string }, index: number) => (
        <ScopeRow
          key={area.key}
          scopeKey={area.key}
          scopeLabel={area.label}
          permissionLevels={permissionLevels}
          tooltipMap={tooltipMap}
          rowPaddingPx={rowPaddingPx}
          isLast={index === areas.length - 1}
          isLocked={isLocked}
          onManualChange={onManualChange}
          initialScopeValue={initialScopes?.[area.key]}
        />
      ))}
    </>
  );
};

export default RolesScopesAndPermissionsList;
