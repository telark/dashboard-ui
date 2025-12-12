import type { Role } from '../../../roles/models/roles';
import type { ValidityType } from '../../../roles/models/types';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';
import { filterByDateRange } from './dateRangeUtils';

export const applyRoleFilters = (
  baseRoles: Role[] | undefined,
  appliedFilters: Record<string, unknown>,
): Role[] => {
  let roles = baseRoles || [];

  const dateRange = appliedFilters.dateRange as DateRangeFilter | undefined;
  roles = filterByDateRange(roles, dateRange, (role) => role.creationDate);

  // Filter by role type
  const filterRoleType = appliedFilters.roleType as string | undefined;
  if (filterRoleType && filterRoleType !== 'all') {
    roles = roles.filter((role) => role.type === filterRoleType);
  }

  // Filter by category
  const filterCategory = appliedFilters.category as string | undefined;
  if (filterCategory && filterCategory !== 'all') {
    roles = roles.filter((role) => role.categoryID === filterCategory);
  }

  // Filter by validity
  const filterValidity = appliedFilters.validity as ValidityType | 'all' | undefined;
  if (filterValidity && filterValidity !== 'all') {
    roles = roles.filter((role) => role.validity?.type === filterValidity);
  }

  // Filter by status
  const filterStatus = appliedFilters.status as string | undefined;
  if (filterStatus && filterStatus !== 'all') {
    roles = roles.filter((role) => role.status === filterStatus);
  }

  return roles;
};
