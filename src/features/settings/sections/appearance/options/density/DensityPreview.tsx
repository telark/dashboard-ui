import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { APPEARANCE_SECTION_CONSTANTS, type DensityOption } from '../../constants';
import {
  DENSITY_PREVIEW_KEYFRAMES,
  DENSITY_PREVIEW_BOX,
  DENSITY_PREVIEW_SAMPLES,
  PREVIEW_ROW_COUNT,
} from './constants';

const { LAYOUT, LABELS, DENSITY_VALUES } = APPEARANCE_SECTION_CONSTANTS;

const cellNoWrap = {
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

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
        {DENSITY_PREVIEW_SAMPLES.names.map((name, i) => (
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
              {DENSITY_PREVIEW_SAMPLES.roles[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
));
DensityPreviewColumn.displayName = 'DensityPreviewColumn';

/** Side-by-side comparison: compact, same-size boxes, refined layout */
export const DensityComparisonPreview: React.FC<{ currentDensity: DensityOption }> = memo(
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
