import React, { memo } from 'react';
import {
  CARD_LAYOUT,
  CARD_TITLE_STYLE,
  DEFAULT_COLORS,
  SPACING,
  getCardShellStyle,
} from '../../../../constants';
import { NoPermissionCard } from '../../../../components/shared';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_STYLES as S } from '../../constants/dashboard';
import type { BoxState } from '../../models';
import BoxBody from './BoxBody';
import ViewAllLink from './ViewAllLink';

export interface DashboardBoxProps extends BoxState {
  title: string;
  icon?: React.ComponentType;
  viewAllTo?: string;
  // Muted text at the header's right, for a box without View all.
  meta?: string;
  // The box's headline value or count, after the title in its style once the data is in.
  value?: React.ReactNode;
  caption?: string;
  // Charts need their tooltip to escape the body; lists keep the clip.
  bodyOverflow?: 'hidden' | 'visible';
  children: React.ReactNode;
}

// The entity cards' shell, not clickable. Fills its grid cell (the row's height); the body clips.
const DashboardBox: React.FC<DashboardBoxProps> = memo(
  ({
    title,
    icon: Icon,
    viewAllTo,
    meta,
    value,
    caption,
    loading,
    failed,
    noAccess,
    bodyOverflow = 'hidden',
    children,
  }) => (
    <section
      style={{
        ...getCardShellStyle(false),
        cursor: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: CARD_LAYOUT.BLOCK_GAP_PX,
        minWidth: 0,
      }}
    >
      <header
        style={{
          display: 'flex',
          // On a narrow box View all or the meta drops under the title rather than truncating it.
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: L.ROW_GAP_PX,
          rowGap: SPACING.XXS,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: L.BOX_ICON_GAP_PX,
            minWidth: 0,
            minHeight: L.BOX_HEADER_MIN_HEIGHT_PX,
          }}
        >
          {Icon ? (
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                flexShrink: 0,
                fontSize: L.BOX_ICON_SIZE_PX,
                color: DEFAULT_COLORS.TEXT_MUTED,
              }}
            >
              <Icon />
            </span>
          ) : null}
          <h2 title={title} style={{ ...CARD_TITLE_STYLE, margin: SPACING.NONE }}>
            {title}
          </h2>
          {/* Beside the title, not in it, so a long title truncates before the value does. */}
          {value !== undefined && !noAccess && !loading && !failed ? (
            <span
              style={{
                ...CARD_TITLE_STYLE,
                flexShrink: 0,
                marginLeft: SPACING.XXS,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
              {caption ? ` ${caption}` : null}
            </span>
          ) : null}
        </div>
        {viewAllTo && !noAccess ? <ViewAllLink to={viewAllTo} /> : null}
        {meta && !viewAllTo && !noAccess ? (
          <span style={{ ...S.MUTED_TEXT, marginLeft: 'auto' }}>{meta}</span>
        ) : null}
      </header>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: bodyOverflow,
          display: 'flex',
          flexDirection: 'column',
          // A box shorter than its row's tallest centers its content, so the space splits evenly.
          justifyContent: 'center',
          gap: L.SECTION_GAP_PX,
        }}
      >
        {noAccess ? (
          <NoPermissionCard {...noAccess} emptyState />
        ) : (
          <BoxBody loading={loading} failed={failed}>
            {children}
          </BoxBody>
        )}
      </div>
    </section>
  ),
);

DashboardBox.displayName = 'DashboardBox';

export default DashboardBox;
