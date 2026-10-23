import React from 'react';
import type { RolesScopesAndPermissionsListProps } from '../../../../models';
import ScopeRow from './ScopeRow';

const RolesScopesAndPermissionsList: React.FC<RolesScopesAndPermissionsListProps> = ({
  areas,
  permissionLevels,
  descriptionMap,
  rowPaddingPx = 4,
  isLocked = false,
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
          descriptionMap={descriptionMap}
          rowPaddingPx={rowPaddingPx}
          isLast={index === areas.length - 1}
          isLocked={isLocked}
          initialScopeValue={initialScopes?.[area.key]}
        />
      ))}
    </>
  );
};

export default RolesScopesAndPermissionsList;
