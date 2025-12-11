import type { FilterField } from '../../../../components/display/panels/filter';

export const GROUP_FILTER_FIELDS: FilterField[] = [
  {
    key: 'dateRange',
    label: 'BY CREATION DATE',
    type: 'dateRange',
    fromLabel: 'From',
    toLabel: 'To',
  },
];
