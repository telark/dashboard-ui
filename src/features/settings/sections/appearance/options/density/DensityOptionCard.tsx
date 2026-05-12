import React, { memo, useCallback, useRef } from 'react';
import { Popover } from 'antd';
import { DEFAULT_COLORS } from '../../../../../../constants';
import SettingsCard from '../../../../components/SettingsCard';
import { APPEARANCE_SECTION_CONSTANTS, type DensityOption } from '../../constants';
import { useAppearance } from '../../AppearanceProvider';
import { DensityComparisonPreview } from './DensityPreview';

const { LAYOUT, LABELS, DENSITY_OPTIONS } = APPEARANCE_SECTION_CONSTANTS;

const DensityOptionCard: React.FC = memo(() => {
  const { density, setDensity } = useAppearance();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((option: DensityOption) => setDensity(option), [setDensity]);

  return (
    <div ref={cardRef}>
      <SettingsCard title={LABELS.DENSITY_CARD_TITLE} description={LABELS.DENSITY_CARD_DESCRIPTION}>
        <Popover
          content={<DensityComparisonPreview currentDensity={density} />}
          trigger="hover"
          placement="top"
          arrow={true}
          mouseEnterDelay={0.25}
          mouseLeaveDelay={0.15}
          getPopupContainer={() => cardRef.current ?? document.body}
          styles={{
            container: {
              padding: 0,
              borderRadius: 10,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              maxWidth: 340,
            },
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
        </Popover>
      </SettingsCard>
    </div>
  );
});

DensityOptionCard.displayName = 'DensityOptionCard';

export default DensityOptionCard;
