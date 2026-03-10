import React, { memo, useCallback } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS, type ThemeOption } from '../../constants';
import { useAppearance } from '../../AppearanceProvider';

const { LAYOUT, LABELS, THEME_OPTIONS } = APPEARANCE_SECTION_CONSTANTS;

const optionsRowStyle = {
  display: 'flex' as const,
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: LAYOUT.OPTION_BUTTON_GAP,
} as const;

const ThemeOptionCard: React.FC = memo(() => {
  const { theme, setTheme } = useAppearance();
  const handleSelect = useCallback((option: ThemeOption) => setTheme(option), [setTheme]);

  return (
    <SettingsCard title={LABELS.THEME_CARD_TITLE} description={LABELS.THEME_CARD_DESCRIPTION}>
      <div style={optionsRowStyle}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = theme === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              style={{
                height: LAYOUT.OPTION_BUTTON_HEIGHT,
                padding: LAYOUT.OPTION_BUTTON_PADDING,
                borderRadius: LAYOUT.OPTION_BUTTON_BORDER_RADIUS,
                border: `1px solid ${isSelected ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.BORDER_LIGHT}`,
                background: isSelected
                  ? `${DEFAULT_COLORS.SUCCESS}18`
                  : DEFAULT_COLORS.BACKGROUND_WHITE,
                color: isSelected ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.TEXT_MUTED,
                fontWeight: isSelected ? 600 : 500,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {option === 'Light'
                ? LABELS.OPTION_LIGHT
                : option === 'Dark'
                  ? LABELS.OPTION_DARK
                  : LABELS.OPTION_SYSTEM}
            </button>
          );
        })}
      </div>
    </SettingsCard>
  );
});

ThemeOptionCard.displayName = 'ThemeOptionCard';

export default ThemeOptionCard;
