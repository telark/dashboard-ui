import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  minWidth?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  onSubmit,
  minWidth = 240,
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <SearchOutlined
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 14,
          color: '#94a3b8',
          pointerEvents: 'none',
        }}
      />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit?.();
          }
        }}
        style={{
          height: 32,
          minWidth,
          padding: '6px 12px 6px 36px',
          borderRadius: 6,
          border: '1px solid #d9d9d9',
          fontSize: 13,
          lineHeight: '20px',
          color: '#0f172a',
          outline: 'none',
          boxShadow: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          WebkitAppearance: 'searchfield',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = DEFAULT_COLORS.SUCCESS;
          e.currentTarget.style.boxShadow = `0 0 0 2px ${DEFAULT_COLORS.SUCCESS}22`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d9d9d9';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default SearchInput;
