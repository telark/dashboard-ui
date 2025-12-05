import React from 'react';
import type { RolesScopesAndPermissionsListProps, PermissionLevel } from '../../../../models';
import ScopeRow from './ScopeRow';

const RolesScopesAndPermissionsList: React.FC<RolesScopesAndPermissionsListProps> = ({
  areas,
  permissionLevels,
  tooltipMap,
  rowPaddingPx = 4,
  isLocked = false,
}) => {
  // Handlers can be extended in the future if needed
  const handleLevelChange = (scopeKey: string, level: PermissionLevel) => {
    void scopeKey;

    void level;
  };

  const handleRuleToggle = (scopeKey: string, formattedKey: string, checked: boolean) => {
    void scopeKey;

    void formattedKey;

    void checked;
  };

  return (
    <>
      {areas.map((area: { key: string; label: string }, index: number) => (
        <ScopeRow
          key={area.key}
          scopeKey={area.key}
          scopeLabel={area.label}
          permissionLevels={permissionLevels}
          tooltipMap={tooltipMap}
          onLevelChange={(scopeKey, level) => handleLevelChange(scopeKey, level)}
          onRuleToggle={(scopeKey, formattedKey, checked) =>
            handleRuleToggle(scopeKey, formattedKey, checked)
          }
          rowPaddingPx={rowPaddingPx}
          isLast={index === areas.length - 1}
          isLocked={isLocked}
        />
      ))}
    </>
  );
};

export default RolesScopesAndPermissionsList;
