import React, { memo, useCallback, useState } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import {
  APPEARANCE_SECTION_CONSTANTS,
  type ThemeOption,
  type DensityOption,
} from './constants';

const { CONTENT } = SETTINGS_CONSTANTS;
const { LAYOUT, LABELS, THEME_OPTIONS, DENSITY_OPTIONS } = APPEARANCE_SECTION_CONSTANTS;

const optionsRowStyle = {
  display: 'flex' as const,
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: LAYOUT.OPTION_BUTTON_GAP,
} as const;

const AppearanceSectionContent: React.FC = memo(() => {
  const [theme, setTheme] = useState<ThemeOption>('Light');
  const [density, setDensity] = useState<DensityOption>('Comfortable');

  const handleThemeSelect = useCallback((option: ThemeOption) => setTheme(option), []);
  const handleDensitySelect = useCallback((option: DensityOption) => setDensity(option), []);

  return (
    <>
      <SettingsCard
        title={LABELS.THEME_CARD_TITLE}
        description={LABELS.THEME_CARD_DESCRIPTION}
      >
        <div style={optionsRowStyle}>
          {THEME_OPTIONS.map((option) => {
            const isSelected = theme === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleThemeSelect(option)}
                style={{
                  height: LAYOUT.OPTION_BUTTON_HEIGHT,
                  padding: LAYOUT.OPTION_BUTTON_PADDING,
                  borderRadius: LAYOUT.OPTION_BUTTON_BORDER_RADIUS,
                  border: `1px solid ${isSelected ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.BORDER_LIGHT}`,
                  background: isSelected ? `${DEFAULT_COLORS.SUCCESS}18` : DEFAULT_COLORS.BACKGROUND_WHITE,
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
      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard
          title={LABELS.DENSITY_CARD_TITLE}
          description={LABELS.DENSITY_CARD_DESCRIPTION}
        >
          <div style={optionsRowStyle}>
            {DENSITY_OPTIONS.map((option) => {
              const isSelected = density === option;
              const label = option === 'Comfortable' ? LABELS.DENSITY_COMFORTABLE : LABELS.DENSITY_COMPACT;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleDensitySelect(option)}
                  style={{
                    height: LAYOUT.OPTION_BUTTON_HEIGHT,
                    padding: LAYOUT.OPTION_BUTTON_PADDING,
                    borderRadius: LAYOUT.OPTION_BUTTON_BORDER_RADIUS,
                    border: `1px solid ${isSelected ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.BORDER_LIGHT}`,
                    background: isSelected ? `${DEFAULT_COLORS.SUCCESS}18` : DEFAULT_COLORS.BACKGROUND_WHITE,
                    color: isSelected ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.TEXT_MUTED,
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </SettingsCard>
      </div>
    </>
  );
});

AppearanceSectionContent.displayName = 'AppearanceSectionContent';

export default AppearanceSectionContent;
