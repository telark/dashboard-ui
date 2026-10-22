import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  HAIRLINE,
  TOOLBAR_CONTROL,
  FONT_SIZE,
  MOTION,
  RADIUS,
  SPACING,
} from '../../../constants';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  minWidth?: number;
  block?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  onSubmit,
  minWidth = 240,
  block = false,
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block', flex: block ? 1 : undefined }}>
      <SearchOutlined
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: FONT_SIZE.BASE,
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
          // Off scale, kept exact: padding 36 (above XXXL), lineHeight 20px (px, LINE_HEIGHT is unitless).
          height: TOOLBAR_CONTROL.HEIGHT,
          boxSizing: 'border-box',
          width: block ? '100%' : undefined,
          minWidth,
          padding: `0 ${SPACING.MD}px 0 36px`,
          borderRadius: RADIUS.SM,
          border: HAIRLINE.SURFACE_BORDER,
          fontSize: FONT_SIZE.MD,
          lineHeight: '20px',
          color: DEFAULT_COLORS.TEXT_ON_SURFACE,
          backgroundColor: DEFAULT_COLORS.SURFACE_WHITE,
          outline: 'none',
          boxShadow: 'none',
          transition: `border-color ${MOTION.BASE_MS}ms`,
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
