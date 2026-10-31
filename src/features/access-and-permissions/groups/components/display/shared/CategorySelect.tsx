import React, { memo } from 'react';
import { Select } from 'antd';
import type { AssignmentSelectOption } from '../../../../roles/models';
import { GROUPS_CONSTANTS as GC } from '../../../constants';

interface CategorySelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: AssignmentSelectOption[];
  placeholder?: string;
  loading?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  filterOption?: (input: string, option?: AssignmentSelectOption) => boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = memo(
  ({
    value,
    onChange,
    options,
    placeholder = 'Select category',
    loading = false,
    allowClear = true,
    showSearch = true,
    filterOption,
  }) => {
    return (
      <Select
        placeholder={placeholder}
        notFoundContent={GC.LABELS.FORM.FIELDS.CATEGORY_EMPTY}
        loading={loading}
        options={options}
        value={value}
        onChange={onChange}
        style={{ width: '100%' }}
        allowClear={allowClear}
        showSearch={showSearch}
        filterOption={filterOption}
      />
    );
  },
);

CategorySelect.displayName = 'CategorySelect';

export default CategorySelect;
