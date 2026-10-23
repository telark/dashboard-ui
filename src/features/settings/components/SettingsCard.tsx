import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../constants';
import {
  DEFAULT_COLORS,
  SECTION_LAYOUT,
  FONT_WEIGHT,
  LINE_HEIGHT,
  SPACING,
} from '../../../constants';

const { CONTENT } = SETTINGS_CONSTANTS;

interface SettingsCardProps {
  title: string;
  description?: string;
  headerStart?: React.ReactNode;
  headerAction?: React.ReactNode;
  /** Small tag rendered next to the title, e.g. an "Experimental" badge. */
  titleBadge?: React.ReactNode;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = memo(
  ({ title, description, headerStart, headerAction, titleBadge, children }) => {
    const hasDescription = description != null && description.length > 0;
    const bodyGap = hasDescription || children ? (hasDescription ? 12 : 16) : 0;
    const headerStyle: React.CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: SPACING.MD,
      marginBottom: bodyGap,
    };

    return (
      <div
        style={{
          background: DEFAULT_COLORS.SURFACE_ELEVATED,
          borderRadius: CONTENT.CARD_BORDER_RADIUS,
          padding: CONTENT.CARD_PADDING,
          border: SECTION_LAYOUT.SUBTLE_DIVIDER,
        }}
      >
        <div style={headerStyle}>
          {headerStart != null ? <div style={{ flexShrink: 0 }}>{headerStart}</div> : null}
          <div style={{ minWidth: CONTENT.CARD_TITLE_MIN_WIDTH_PX, flex: 1 }}>
            {title.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  gap: SPACING.SM,
                }}
              >
                {/* h2: the card sits right under the page's h1. Its look is all inline. */}
                <h2
                  style={{
                    margin: SPACING.NONE,
                    fontSize: CONTENT.CARD_TITLE_FONT_SIZE,
                    fontWeight: FONT_WEIGHT.SEMIBOLD,
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                  }}
                >
                  {title}
                </h2>
                {titleBadge != null ? (
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
                    {titleBadge}
                  </span>
                ) : null}
              </div>
            )}
            {hasDescription && (
              <p
                style={{
                  // Off scale, kept exact: margin 1 (NONE to XXS).
                  // The negative pull is tuned for a bare heading's leading; a
                  // titleBadge sits in the row as a real box with no such
                  // leading, so it needs a normal positive gap instead or the
                  // pull drags this text up under the badge.
                  margin:
                    title.length === 0
                      ? SPACING.NONE
                      : titleBadge != null
                        ? '1px 0 0'
                        : `${CONTENT.CARD_TITLE_TO_DESCRIPTION_GAP_PX}px 0 0`,
                  fontSize: CONTENT.CARD_DESCRIPTION_FONT_SIZE,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  lineHeight: LINE_HEIGHT.BASE,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {headerAction != null ? (
            <div
              style={{
                flexShrink: 0,
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: SPACING.SM,
              }}
            >
              {headerAction}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    );
  },
);

SettingsCard.displayName = 'SettingsCard';

export default SettingsCard;
