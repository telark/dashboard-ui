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
    type: 'buttonGroup',
    options: categoryOptions.map((opt) => ({ key: opt.value, label: opt.label })),
    defaultValue: 'all',
  },
];
