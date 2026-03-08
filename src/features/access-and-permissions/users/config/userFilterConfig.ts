import type { FilterField } from '../../../../components/display/panels/filter';
import { USERS_CONSTANTS as UC } from '../constants';

export const buildUserFilterFields = (): FilterField[] => [
  {
    key: 'dateRange',
    label: UC.LABELS.FILTER.LABELS.BY_CREATION_DATE,
    type: 'dateRange',
    fromLabel: UC.LABELS.FILTER.LABELS.FROM,
    toLabel: UC.LABELS.FILTER.LABELS.TO,
  },
  {
    key: 'status',
    label: UC.LABELS.FILTER.LABELS.BY_STATUS,
    type: 'buttonGroup',
    options: [
      { key: 'all', label: UC.LABELS.FILTER.STATUS_OPTIONS.ALL },
      { key: 'active', label: UC.LABELS.FILTER.STATUS_OPTIONS.ACTIVE },
      { key: 'inactive', label: UC.LABELS.FILTER.STATUS_OPTIONS.INACTIVE },
    ],
    defaultValue: 'all',
  },
];
