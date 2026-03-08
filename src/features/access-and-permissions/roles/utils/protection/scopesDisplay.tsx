import React from 'react';
import type { Role } from '../../models';
import type { ScopeAndPermissions } from '../../models';

export interface ScopesDisplayOptions {
  scopesAndPermissions: ScopeAndPermissions[];
  getScopeLabel: (scopeKey: string) => string;
  scopesContainerStyle: React.CSSProperties;
  scopeItemStyle: React.CSSProperties;
}

export const getRoleScopesContent = (
  role: Role,
  options: ScopesDisplayOptions,
): React.ReactNode => {
  if (!role.scopesAndPermissions || role.scopesAndPermissions.length === 0) {
    return null;
  }

  return (
    <div style={options.scopesContainerStyle}>
      {role.scopesAndPermissions.map((scope, index) => (
        <span key={`${scope.scope}-${index}`} style={options.scopeItemStyle}>
          {options.getScopeLabel(scope.scope)}: {scope.level}
        </span>
      ))}
    </div>
  );
};
