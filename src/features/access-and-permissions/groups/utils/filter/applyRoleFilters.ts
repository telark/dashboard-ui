import type { Role } from '../../../roles/models/roles';
import type { ValidityType } from '../../../roles/models/types';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';
import { filterByDateRange } from './dateRangeUtils';
import { applySearch } from '../../../../../utils/search/applySearch';

export const applyRoleFilters = (
  baseRoles: Role[] | undefined,
  appliedFilters: Record<string, unknown>,
  searchTerm?: string,
): Role[] => {
  let roles = baseRoles || [];

  if (searchTerm) {
    roles = applySearch(roles, searchTerm, [
      (role) => role.name,
      (role) => role.type,
      (role) => role.status,
      (role) => role.validity?.type,
    ]);
  }

  const dateRange = appliedFilters.dateRange as DateRangeFilter | undefined;
  roles = filterByDateRange(roles, dateRange, (role) => role.creationDate);

  const filterRoleType = appliedFilters.roleType as string | undefined;
  if (filterRoleType && filterRoleType !== 'all') {
    roles = roles.filter((role) => role.type === filterRoleType);
  }

  const filterCategory = appliedFilters.category as string | undefined;
  if (filterCategory && filterCategory !== 'all') {
    roles = roles.filter((role) => role.categoryID === filterCategory);
  }

  const filterValidity = appliedFilters.validity as ValidityType | 'all' | undefined;
  if (filterValidity && filterValidity !== 'all') {
    roles = roles.filter((role) => role.validity?.type === filterValidity);
  }

  const filterStatus = appliedFilters.status as string | undefined;
  if (filterStatus && filterStatus !== 'all') {
    roles = roles.filter((role) => role.status === filterStatus);
  }

  return roles;
};
