import dayjs from 'dayjs';
import type { Role } from '../../../roles/models/roles';
import type { ValidityType } from '../../../roles/models/types';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';

export const applyRoleFilters = (
  baseRoles: Role[] | undefined,
  appliedFilters: Record<string, unknown>,
): Role[] => {
  let roles = baseRoles || [];

  // Date range filter
  const dateRange = appliedFilters.dateRange as DateRangeFilter | undefined;
  if (dateRange?.from || dateRange?.to) {
    const from = dateRange.from ? dayjs(dateRange.from).startOf('day') : null;
    const to = dateRange.to ? dayjs(dateRange.to).endOf('day') : null;

    roles = roles.filter((role) => {
      const roleDate = dayjs(role.creationDate);
      if (from && roleDate.isBefore(from)) return false;
      if (to && roleDate.isAfter(to)) return false;
      return true;
    });
  }

  // Validity filter
  const filterValidity = appliedFilters.type as ValidityType | 'all' | undefined;
  if (filterValidity && filterValidity !== 'all') {
    roles = roles.filter((role) => role.validity?.type === filterValidity);
  }

  // Status filter
  const filterStatus = appliedFilters.status as string | undefined;
  if (filterStatus && filterStatus !== 'all') {
    roles = roles.filter((role) => role.status === filterStatus);
  }

  return roles;
};
