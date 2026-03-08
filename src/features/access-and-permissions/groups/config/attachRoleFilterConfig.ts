import type { FilterField } from '../../../../components/display/panels/filter';
import type { FilterOption } from '../../../../interfaces/layout/filters';
import { ROLES_CONSTANTS as RC } from '../../roles/constants/roles';
import { GROUPS_CONSTANTS as GC } from '../constants';

export const buildAttachRoleFilterFields = (categoryOptions: FilterOption[]): FilterField[] => [
  {
    key: 'dateRange',
    label: GC.LABELS.FILTER.LABELS.BY_CREATION_DATE,
    type: 'dateRange',
    fromLabel: GC.LABELS.FILTER.LABELS.FROM,
    toLabel: GC.LABELS.FILTER.LABELS.TO,
  },
  {
    key: 'roleType',
    label: GC.LABELS.FILTER.LABELS.BY_TYPE,
    type: 'buttonGroup',
    options: [
      { key: 'all', label: GC.LABELS.FILTER.OPTIONS.ALL },
      { key: RC.VALUES.ROLE_TYPE_BUILT_IN, label: GC.LABELS.FILTER.OPTIONS.BUILT_IN },
      { key: RC.VALUES.ROLE_TYPE_CUSTOM, label: GC.LABELS.FILTER.OPTIONS.CUSTOM },
    ],
    defaultValue: 'all',
  },
  {
    key: 'category',
    label: GC.LABELS.FILTER.LABELS.BY_CATEGORY,
    type: 'buttonGroup',
    options: categoryOptions.map((opt) => ({ key: opt.value, label: opt.label })),
    defaultValue: 'all',
  },
  {
    key: 'validity',
    label: GC.LABELS.FILTER.LABELS.BY_VALIDITY,
    type: 'buttonGroup',
    options: [
      { key: 'all', label: 'All' },
      { key: 'permanent', label: 'Permanent' },
      { key: 'temporary', label: 'Temporary' },
      { key: 'sessionBased', label: 'Session-based' },
    ],
    defaultValue: 'all',
  },
  {
    key: 'status',
    label: GC.LABELS.FILTER.LABELS.BY_STATUS,
    type: 'buttonGroup',
    options: [
      { key: 'all', label: GC.LABELS.FILTER.OPTIONS.ALL },
      { key: 'Active', label: GC.LABELS.FILTER.OPTIONS.ACTIVE },
      { key: 'Inactive', label: GC.LABELS.FILTER.OPTIONS.INACTIVE },
    ],
    defaultValue: 'all',
  },
];
