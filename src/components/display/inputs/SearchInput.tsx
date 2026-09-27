import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, TOOLBAR_CONTROL } from '../../../constants';

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
          color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
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
          height: TOOLBAR_CONTROL.HEIGHT,
          boxSizing: 'border-box',
          minWidth,
          padding: '0 12px 0 36px',
          borderRadius: 6,
          border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
          fontSize: 13,
          lineHeight: '20px',
          color: DEFAULT_COLORS.TEXT_ON_SURFACE,
          backgroundColor: DEFAULT_COLORS.SURFACE_WHITE,
          outline: 'none',
          boxShadow: 'none',
          transition: 'border-color 0.2s',
          WebkitAppearance: 'searchfield',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = DEFAULT_COLORS.TEXT_ON_SURFACE;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = DEFAULT_COLORS.SURFACE_BORDER;
        }}
      />
    </div>
  );
};

export default SearchInput;
