import React, { memo, useCallback, useState, useEffect } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import {
  APPEARANCE_SECTION_CONSTANTS,
  type ThemeOption,
  type DensityOption,
  type FontSizeOption,
} from './constants';

const { CONTENT } = SETTINGS_CONSTANTS;
const {
  STORAGE_KEYS,
  LAYOUT,
  LABELS,
  THEME_OPTIONS,
  DENSITY_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_SIZE_SCALES,
  FONT_SIZE_CSS_VAR,
} = APPEARANCE_SECTION_CONSTANTS;

const getStored = <T extends string>(key: string, fallback: T): T =>
  ((typeof window !== 'undefined' && localStorage.getItem(key)) as T | null) ?? fallback;

const optionsRowStyle = {
  display: 'flex' as const,
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: LAYOUT.OPTION_BUTTON_GAP,
} as const;

const resolveTheme = (theme: ThemeOption): 'light' | 'dark' => {
  if (theme === 'System' && typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme === 'Dark' ? 'dark' : 'light';
};

const AppearanceSectionContent: React.FC = memo(() => {
  const [theme, setTheme] = useState<ThemeOption>(() => getStored(STORAGE_KEYS.THEME, 'Light'));
  const [density, setDensity] = useState<DensityOption>(() =>
    getStored(STORAGE_KEYS.DENSITY, 'Comfortable'),
  );
  const [fontSize, setFontSize] = useState<FontSizeOption>(() =>
    getStored(STORAGE_KEYS.FONT_SIZE, 'Medium'),
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      FONT_SIZE_CSS_VAR,
      String(FONT_SIZE_SCALES[fontSize]),
    );
  }, [fontSize]);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    document.documentElement.setAttribute('data-theme', resolved);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored === 'System') {
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const handleThemeSelect = useCallback((option: ThemeOption) => {
    setTheme(option);
    localStorage.setItem(STORAGE_KEYS.THEME, option);
  }, []);
  const handleDensitySelect = useCallback((option: DensityOption) => {
    setDensity(option);
    localStorage.setItem(STORAGE_KEYS.DENSITY, option);
  }, []);
  const handleFontSizeSelect = useCallback((option: FontSizeOption) => {
    setFontSize(option);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, option);
  }, []);

  return (
    <>
      <SettingsCard title={LABELS.THEME_CARD_TITLE} description={LABELS.THEME_CARD_DESCRIPTION}>
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
      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard
          title={LABELS.DENSITY_CARD_TITLE}
          description={LABELS.DENSITY_CARD_DESCRIPTION}
        >
          <div style={optionsRowStyle}>
            {DENSITY_OPTIONS.map((option) => {
              const isSelected = density === option;
              const label =
                option === 'Comfortable' ? LABELS.DENSITY_COMFORTABLE : LABELS.DENSITY_COMPACT;
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
                    background: isSelected
                      ? `${DEFAULT_COLORS.SUCCESS}18`
                      : DEFAULT_COLORS.BACKGROUND_WHITE,
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
      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard
          title={LABELS.FONT_SIZE_CARD_TITLE}
          description={LABELS.FONT_SIZE_CARD_DESCRIPTION}
        >
          <div style={optionsRowStyle}>
            {FONT_SIZE_OPTIONS.map((option) => {
              const isSelected = fontSize === option;
              const label =
                option === 'Small'
                  ? LABELS.FONT_SIZE_SMALL
                  : option === 'Medium'
                    ? LABELS.FONT_SIZE_MEDIUM
                    : LABELS.FONT_SIZE_LARGE;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleFontSizeSelect(option)}
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
