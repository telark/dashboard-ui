import type { ScopeAndPermissions } from '../../models';
import type { ScopeFormValue } from '../../models/roleForm';

export const convertScopesToAPI = (
  scopes: Record<string, ScopeFormValue>,
): ScopeAndPermissions[] => {
  return Object.entries(scopes)
    .filter(([, scopeValue]) => scopeValue && scopeValue.level)
    .map(([scope, scopeValue]) => {
      const result: ScopeAndPermissions = {
        scope,
        level: scopeValue.level,
      };

      const rules = scopeValue.rules?.filter(Boolean) || [];
      const uniqueRules = Array.from(new Set(rules));
      result.rules = uniqueRules;

      return result;
    });
};

export const convertScopesFromAPI = (
  scopesAndPermissions: ScopeAndPermissions[],
): Record<string, ScopeFormValue> => {
  const result: Record<string, ScopeFormValue> = {};
  scopesAndPermissions.forEach(({ scope, level, rules }) => {
    result[scope] = {
      level,
      rules: rules || [],
    };
  });
  return result;
};
