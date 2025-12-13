import type { FilterField } from '../../../../components/display/panels/filter';
import type { FilterOption } from '../../../../interfaces/layout/filters';
import { GROUPS_CONSTANTS as GC } from '../constants';

export const buildGroupFilterFields = (categoryOptions: FilterOption[]): FilterField[] => [
  {
    key: 'dateRange',
    label: GC.LABELS.FILTER.LABELS.BY_CREATION_DATE,
    type: 'dateRange',
    fromLabel: GC.LABELS.FILTER.LABELS.FROM,
    toLabel: GC.LABELS.FILTER.LABELS.TO,
  },
  {
    key: 'category',
    label: GC.LABELS.FILTER.LABELS.BY_CATEGORY,
    type: 'buttonGroup',
    options: categoryOptions.map((opt) => ({ key: opt.value, label: opt.label })),
    defaultValue: 'all',
  },
];
