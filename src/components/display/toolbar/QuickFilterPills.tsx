import React from 'react';
import {
  LIST_TOOLBAR,
  TOOLBAR_CONTROL,
  getQuickFilterPillColors,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
} from '../../../constants';

interface QuickFilterPillOption<K extends string> {
  key: K;
  label: string;
  /** A DEFAULT_COLORS accent. */
  accent: string;
  count: React.ReactNode;
}

interface QuickFilterPillsProps<K extends string> {
  options: readonly QuickFilterPillOption<K>[];
  /** null: no pill matches the current filter. */
  active: K | null;
  onChange: (next: K) => void;
}

const pillStyle = (accent: string, isActive: boolean): React.CSSProperties => ({
  all: 'unset',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: SPACING.S6,
  height: TOOLBAR_CONTROL.HEIGHT,
  boxSizing: 'border-box',
  padding: TOOLBAR_CONTROL.PADDING,
  borderRadius: LIST_TOOLBAR.PILL_RADIUS_PX,
  ...getQuickFilterPillColors(accent, isActive),
  fontSize: FONT_SIZE.SM,
  fontWeight: FONT_WEIGHT.BOLD,
  lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
  userSelect: 'none',
});

const QuickFilterPills = <K extends string>({
  options,
  active,
  onChange,
}: QuickFilterPillsProps<K>): React.ReactElement => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.S6, height: '100%' }}>
    {options.map((option) => {
      const isActive = active === option.key;
      return (
        <button
          key={option.key}
          type="button"
          aria-pressed={isActive}
          className={LIST_TOOLBAR.QUICK_FILTER_CLASS}
          onClick={() => onChange(option.key)}
          style={pillStyle(option.accent, isActive)}
        >
          <span>{option.label}</span>
          <span style={{ opacity: 0.85 }}>· {option.count}</span>
        </button>
      );
    })}
  </div>
);

export default QuickFilterPills;
