import type { FilterField } from '../../../../components/display/panels/filter';

export const ATTACH_ROLE_FILTER_FIELDS: FilterField[] = [
  {
    key: 'dateRange',
    label: 'DATE FILTER',
    type: 'dateRange',
    fromLabel: 'Created From',
    toLabel: 'Created To',
  },
  {
    key: 'type',
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
