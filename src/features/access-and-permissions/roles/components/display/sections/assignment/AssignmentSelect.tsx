import React, { memo } from 'react';
import { Select } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import { DEFAULT_COLORS } from '../../../../../../../constants/shared/colors';
import type { AssignmentSelectProps } from '../../../../models';

const AssignmentSelect: React.FC<AssignmentSelectProps> = memo(
  ({
    value,
    onChange,
    options,
    placeholder = 'Select',
    loading = false,
    allOptionsMap,
    className,
    allowClear = true,
    showSearch = true,
    filterOption,
  }) => {
    return (
      <Select
        mode="multiple"
        placeholder={placeholder}
        loading={loading}
        maxTagCount="responsive"
        options={options}
        value={value}
        onChange={onChange}
        className={className}
        style={{ width: '100%' }}
        allowClear={allowClear}
        showSearch={showSearch}
        filterOption={filterOption}
        tagRender={(props) => {
          const { label, value: tagValue } = props;
          const displayName = allOptionsMap?.get(tagValue as string) || label;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 8px',
                height: '24px',
                lineHeight: '24px',
                backgroundColor: DEFAULT_COLORS.SUCCESS,
                color: DEFAULT_COLORS.PILL_TEXT,
                borderRadius: '4px',
                marginRight: '4px',
                fontSize: '14px',
              }}
            >
              {displayName}
              <span
                onClick={props.onClose}
                style={{
                  marginLeft: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <AiOutlineClose size={14} />
              </span>
            </span>
          );
        }}
      />
    );
  },
);

AssignmentSelect.displayName = 'AssignmentSelect';

export default AssignmentSelect;
