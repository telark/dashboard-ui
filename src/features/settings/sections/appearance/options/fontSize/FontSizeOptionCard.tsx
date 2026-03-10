import React, { memo, useCallback } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS, type FontSizeOption } from '../../constants';
import { useAppearance } from '../../AppearanceProvider';

const { LAYOUT, LABELS, FONT_SIZE_OPTIONS } = APPEARANCE_SECTION_CONSTANTS;

const optionsRowStyle = {
  display: 'flex' as const,
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: LAYOUT.OPTION_BUTTON_GAP,
} as const;

const FontSizeOptionCard: React.FC = memo(() => {
  const { fontSize, setFontSize } = useAppearance();
  const handleSelect = useCallback((option: FontSizeOption) => setFontSize(option), [setFontSize]);

  return (
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
              {label}
            </button>
          );
        })}
      </div>
    </SettingsCard>
  );
});

FontSizeOptionCard.displayName = 'FontSizeOptionCard';

export default FontSizeOptionCard;
