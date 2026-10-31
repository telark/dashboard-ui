import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import {
  CARD_LAYOUT,
  DEFAULT_COLORS,
  FONT_WEIGHT,
  SPACING,
  STEP_STRIP,
  withAlpha,
} from '../../../constants';

const ELLIPSIS: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

// Steps side by side, wrapping when the box is too narrow for each to keep MIN_COLUMN_PX.
export const StepList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ol
    style={{
      listStyle: 'none',
      margin: SPACING.NONE,
      padding: SPACING.NONE,
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(min(${STEP_STRIP.MIN_COLUMN_PX}px, 100%), 1fr))`,
      gap: CARD_LAYOUT.GRID_GAP_PX,
    }}
  >
    {children}
  </ol>
);

interface StepProps {
  number: number;
  title: string;
  // A teal check replaces the number, and the track to the next step turns teal.
  done?: boolean;
  // The last step draws no track.
  last?: boolean;
  children?: React.ReactNode;
}

export const Step: React.FC<StepProps> = ({
  number,
  title,
  done = false,
  last = false,
  children,
}) => (
  <li
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: STEP_STRIP.NUMBER_GAP_PX,
      minWidth: 0,
    }}
  >
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: STEP_STRIP.NUMBER_SIZE_PX,
        height: STEP_STRIP.NUMBER_SIZE_PX,
        borderRadius: '50%',
        background: done ? DEFAULT_COLORS.SUCCESS_TINT : DEFAULT_COLORS.CHIP_CUSTOM_BG,
        color: done ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.TEXT_SECONDARY,
        fontSize: STEP_STRIP.NUMBER_FONT_SIZE_PX,
        fontWeight: FONT_WEIGHT.SEMIBOLD,
      }}
    >
      {done ? <CheckOutlined style={{ fontSize: STEP_STRIP.CHECK_SIZE_PX }} /> : number}
    </span>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: SPACING.XS,
        minWidth: 0,
      }}
    >
      <div
        style={{
          alignSelf: 'stretch',
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.MD,
          minHeight: STEP_STRIP.NUMBER_SIZE_PX,
        }}
      >
        <span
          style={{
            ...ELLIPSIS,
            fontSize: STEP_STRIP.TITLE_FONT_SIZE_PX,
            fontWeight: FONT_WEIGHT.SEMIBOLD,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {title}
        </span>
        {last ? null : (
          <span
            aria-hidden
            style={{
              flex: 1,
              minWidth: SPACING.LG,
              height: 1,
              marginRight: SPACING.MD,
              background: done
                ? withAlpha(DEFAULT_COLORS.SUCCESS, STEP_STRIP.TRACK_DONE_ALPHA)
                : DEFAULT_COLORS.BORDER_ELEVATED,
            }}
          />
        )}
      </div>
      {children}
    </div>
  </li>
);
