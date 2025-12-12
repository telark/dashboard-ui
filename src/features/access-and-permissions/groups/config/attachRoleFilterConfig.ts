import type { FilterField } from '../../../../components/display/panels/filter';
import type { FilterOption } from '../../../../interfaces/layout/filters';
import { ROLES_CONSTANTS as RC } from '../../roles/constants/roles';

export const buildAttachRoleFilterFields = (categoryOptions: FilterOption[]): FilterField[] => [
  {
    key: 'dateRange',
    label: 'BY CREATION DATE',
    type: 'dateRange',
    fromLabel: 'From',
    toLabel: 'To',
  },
  {
    key: 'roleType',
    label: 'BY TYPE',
    type: 'buttonGroup',
    options: [
      { key: 'all', label: 'All' },
      { key: RC.VALUES.ROLE_TYPE_BUILT_IN, label: 'Built-in' },
      { key: RC.VALUES.ROLE_TYPE_CUSTOM, label: 'Custom' },
    ],
    defaultValue: 'all',
  },
  {
    key: 'category',
    label: 'BY CATEGORY',
    type: 'buttonGroup',
    options: categoryOptions.map((opt) => ({ key: opt.value, label: opt.label })),
    defaultValue: 'all',
  },
  {
    key: 'validity',
    label: 'BY VALIDITY',
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
    label: 'BY STATUS',
    type: 'buttonGroup',
    options: [
      { key: 'all', label: 'All' },
      { key: 'Active', label: 'Active' },
      { key: 'Inactive', label: 'Inactive' },
    ],
    defaultValue: 'all',
  },
];
