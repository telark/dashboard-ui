import React, { memo, useCallback, useRef } from 'react';
import { Popover } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import {
  APPEARANCE_SECTION_CONSTANTS,
  type ThemeOption,
  type DensityOption,
  type FontSizeOption,
} from './constants';
import { useAppearance } from './AppearanceProvider';

const { CONTENT } = SETTINGS_CONSTANTS;
const {
  LAYOUT,
  LABELS,
  THEME_OPTIONS,
  DENSITY_OPTIONS,
  DENSITY_VALUES,
  DENSITY_PREVIEW_BOX,
  FONT_SIZE_OPTIONS,
} = APPEARANCE_SECTION_CONSTANTS;

const optionsRowStyle = {
  display: 'flex' as const,
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: LAYOUT.OPTION_BUTTON_GAP,
} as const;

const DENSITY_PREVIEW_KEYFRAMES = `
  @keyframes densityPreviewFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PREVIEW_SAMPLES = APPEARANCE_SECTION_CONSTANTS.DENSITY_PREVIEW_SAMPLES;
const PREVIEW_ROW_COUNT = PREVIEW_SAMPLES.names.length;

const cellNoWrap = {
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/** Single column: fixed size, no wrap/overflow, refined card */
const DensityPreviewColumn: React.FC<{
  rowHeight: number;
  label: string;
  isSelected: boolean;
}> = memo(({ rowHeight, label, isSelected }) => (
  <div
    style={{
      width: DENSITY_PREVIEW_BOX.WIDTH,
      height: DENSITY_PREVIEW_BOX.HEIGHT,
      flexShrink: 0,
      borderRadius: LAYOUT.OPTION_BUTTON_BORDER_RADIUS,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${isSelected ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.BORDER_LIGHT}`,
      background: DEFAULT_COLORS.BACKGROUND_WHITE,
      animation: 'densityPreviewFadeIn 0.2s ease-out',
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      boxShadow: isSelected ? '0 2px 12px rgba(32,201,151,0.14)' : '0 1px 4px rgba(0,0,0,0.06)',
    }}
  >
    <style>{DENSITY_PREVIEW_KEYFRAMES}</style>
    <div
      style={{
        padding: '6px 10px',
        flexShrink: 0,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: isSelected ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.TEXT_MUTED,
        textTransform: 'uppercase',
        background: isSelected ? 'rgba(32,201,151,0.06)' : 'rgba(0,0,0,0.02)',
        borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
      }}
    >
      {label}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 48px',
          gap: 6,
          alignItems: 'center',
          height: 22,
          padding: '0 10px',
          flexShrink: 0,
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.03em',
          color: DEFAULT_COLORS.TEXT_MUTED,
          textTransform: 'uppercase',
          background: 'rgba(0,0,0,0.02)',
          borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        }}
      >
        <span style={cellNoWrap}>{LABELS.DENSITY_PREVIEW_HEADER_NAME}</span>
        <span style={cellNoWrap}>{LABELS.DENSITY_PREVIEW_HEADER_ROLE}</span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {PREVIEW_SAMPLES.names.map((name, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 48px',
              gap: 6,
              alignItems: 'center',
              paddingLeft: 10,
              paddingRight: 10,
              height: rowHeight,
              flexShrink: 0,
              fontSize: 11,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
              borderBottom:
                i < PREVIEW_ROW_COUNT - 1 ? `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}` : undefined,
            }}
          >
            <span style={{ fontWeight: 500, ...cellNoWrap }}>{name}</span>
            <span style={{ fontSize: 10, color: DEFAULT_COLORS.TEXT_MUTED, ...cellNoWrap }}>
              {PREVIEW_SAMPLES.roles[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
));
DensityPreviewColumn.displayName = 'DensityPreviewColumn';

/** Side-by-side comparison: compact, same-size boxes, refined layout */
const DensityComparisonPreview: React.FC<{ currentDensity: DensityOption }> = memo(
  ({ currentDensity }) => (
    <div
      style={{
        padding: '10px 12px 12px',
        animation: 'densityPreviewFadeIn 0.2s ease-out',
      }}
    >
      <style>{DENSITY_PREVIEW_KEYFRAMES}</style>
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: DEFAULT_COLORS.TEXT_MUTED,
          marginBottom: 8,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {LABELS.DENSITY_LIVE_EXAMPLE_LABEL}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: 10,
          alignItems: 'stretch',
        }}
      >
        <DensityPreviewColumn
          rowHeight={DENSITY_VALUES.Comfortable.rowHeight}
          label={LABELS.DENSITY_COMFORTABLE}
          isSelected={currentDensity === 'Comfortable'}
        />
        <DensityPreviewColumn
          rowHeight={DENSITY_VALUES.Compact.rowHeight}
          label={LABELS.DENSITY_COMPACT}
          isSelected={currentDensity === 'Compact'}
        />
      </div>
    </div>
  ),
);
DensityComparisonPreview.displayName = 'DensityComparisonPreview';

const AppearanceSectionContent: React.FC = memo(() => {
  const { theme, setTheme, density, setDensity, fontSize, setFontSize } = useAppearance();
  const densityCardRef = useRef<HTMLDivElement>(null);

  const handleThemeSelect = useCallback((option: ThemeOption) => setTheme(option), [setTheme]);
  const handleDensitySelect = useCallback(
    (option: DensityOption) => setDensity(option),
    [setDensity],
  );
  const handleFontSizeSelect = useCallback(
    (option: FontSizeOption) => setFontSize(option),
    [setFontSize],
  );

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
      <div ref={densityCardRef} style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <SettingsCard
          title={LABELS.DENSITY_CARD_TITLE}
          description={LABELS.DENSITY_CARD_DESCRIPTION}
        >
          <Popover
            content={<DensityComparisonPreview currentDensity={density} />}
            trigger="hover"
            placement="bottom"
            arrow={true}
            mouseEnterDelay={0.25}
            mouseLeaveDelay={0.15}
            getPopupContainer={() => densityCardRef.current ?? document.body}
            overlayInnerStyle={{
              padding: 0,
              borderRadius: 10,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              maxWidth: 340,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: LAYOUT.OPTION_BUTTON_GAP,
                cursor: 'default',
              }}
            >
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
          </Popover>
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
