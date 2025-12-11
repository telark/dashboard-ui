import type { FilterField } from '../../../../components/display/panels/filter';
import type { FilterOption } from '../../../../interfaces/layout/filters';

export const buildGroupFilterFields = (categoryOptions: FilterOption[]): FilterField[] => [
  {
    key: 'dateRange',
    label: 'BY CREATION DATE',
    type: 'dateRange',
    fromLabel: 'From',
    toLabel: 'To',
  },
  {
    key: 'category',
    label: 'BY CATEGORY',
    type: 'dropdown',
    dropdownOptions: [
      { value: 'all', label: 'All categories' },
      ...categoryOptions.map((opt) => ({ value: opt.value, label: opt.label })),
    ],
    defaultValue: 'all',
  },
];
