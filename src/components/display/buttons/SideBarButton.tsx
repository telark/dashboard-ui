import React, { useState, useCallback, memo } from 'react';
import { Badge, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_COLORS,
  BUTTON_CONFIGS,
  BUTTON_COLORS,
  SIDEBAR_LAYOUT,
  FONT_SIZE,
  MOTION,
  getSidebarLabelFade,
} from '../../../constants';
import { ButtonInterface } from '../../../interfaces/shared';
import { useMediaQuery } from '../../../hooks/layout';

// The only part that reads the location (useNavigate does), so a navigation re-renders this plain
// button instead of every SidebarButton and its tooltip.
const NavButton: React.FC<React.ComponentProps<'button'> & { route: string }> = ({
  route,
  ...props
}) => {
  const navigate = useNavigate();
  return <button type="button" {...props} onClick={() => navigate(route)} />;
};

const ICON_SIZE_PX = 16;

// antd rings the count in the page color: the sidebar's count has no ring (user, 2026-10-20).
const BADGE_STYLES = { indicator: { boxShadow: 'none' } };

interface SidebarButtonProps extends ButtonInterface {
  isCollapsed?: boolean;
  // A count shown after the label (over the icon when collapsed); badgeLabel names it for screen readers.
  badge?: number;
  badgeLabel?: string;
  // Shown under the icon on the forced phone rail, where touch can't reveal the tooltip.
  railLabel?: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = memo(
  ({ text, icon, active, route, isCollapsed = false, badge = 0, badgeLabel, railLabel }) => {
    const [isHovered, setIsHovered] = useState(false);
    const SB = BUTTON_CONFIGS.SIDEBAR_BUTTON;
    const forcedRail = useMediaQuery(SIDEBAR_LAYOUT.FORCE_COLLAPSE_QUERY);
    const labeled = isCollapsed && forcedRail && Boolean(railLabel);
    const collapsedMarginX = labeled ? SB.RAIL.MARGIN_X : SB.COLLAPSED_MARGIN_X;
    // Left-aligned in both states with the icon centered in the rail, so a toggle never moves it.
    const collapsedPadding = labeled
      ? SB.RAIL.PADDING
      : `0 0 0 ${(SIDEBAR_LAYOUT.WIDTH_COLLAPSED - 2 * SB.COLLAPSED_MARGIN_X - ICON_SIZE_PX) / 2}px`;

    const isActive = Boolean(active);
    const isActiveOrHovered = isActive || isHovered;
    const accentColor = DEFAULT_COLORS.TEXT_MUTED;
    const iconColor = isActiveOrHovered ? accentColor : BUTTON_COLORS.ICON_DEFAULT;
    const textColor = isActiveOrHovered ? accentColor : BUTTON_COLORS.TEXT_DEFAULT;

    const coloredIcon = React.isValidElement(icon)
      ? React.cloneElement(icon, {
          style: {
            color: iconColor,
            fontSize: FONT_SIZE.LG,
            width: ICON_SIZE_PX,
            height: ICON_SIZE_PX,
            flexShrink: 0,
            transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}`,
          },
        } as React.Attributes)
      : icon;

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const badged = badge > 0;
    let accessibleName = isCollapsed ? String(text) : undefined;
    if (badged && badgeLabel) accessibleName = `${text}, ${badgeLabel}`;

    const button = (
      <NavButton
        route={route}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-current={isActive ? 'page' : undefined}
        aria-label={accessibleName}
        style={{
          display: 'flex',
          flexDirection: labeled ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: labeled ? 'center' : 'flex-start',
          textAlign: 'left',
          gap: labeled ? SB.RAIL.GAP : SB.GAP,
          height: labeled ? 'auto' : SB.HEIGHT,
          padding: isCollapsed ? collapsedPadding : SB.PADDING,
          marginLeft: isCollapsed ? collapsedMarginX : SB.MARGIN_LEFT,
          marginRight: isCollapsed ? collapsedMarginX : SB.MARGIN_RIGHT,
          border: 'none',
          borderRadius: SB.BORDER_RADIUS,
          backgroundColor: isActiveOrHovered ? DEFAULT_COLORS.HOVER_BG : 'transparent',
          color: textColor,
          fontWeight: SB.FONT_WEIGHT,
          fontSize: SB.FONT_SIZE,
          cursor: 'pointer',
          transition: `${SB.TRANSITION}, ${SIDEBAR_LAYOUT.PADDING_TRANSITION}`,
          boxSizing: 'border-box',
        }}
      >
        {/* Kept mounted: the count zooms onto the icon as the label's count fades out. */}
        {badged ? (
          <Badge
            count={isCollapsed ? badge : 0}
            size="small"
            overflowCount={9}
            styles={BADGE_STYLES}
          >
            {coloredIcon}
          </Badge>
        ) : (
          coloredIcon
        )}
        {labeled ? null : (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
              fontWeight: SB.FONT_WEIGHT,
              fontSize: SB.FONT_SIZE,
              color: textColor,
              ...getSidebarLabelFade(isCollapsed),
              transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}, ${getSidebarLabelFade(isCollapsed).transition}`,
            }}
          >
            {text}
          </span>
        )}
        {badged && !labeled ? (
          <span
            style={{ display: 'inline-flex', flexShrink: 0, ...getSidebarLabelFade(isCollapsed) }}
          >
            <Badge count={badge} overflowCount={99} styles={BADGE_STYLES} />
          </span>
        ) : null}
        {labeled ? (
          <span
            style={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: SB.RAIL.LABEL_FONT_SIZE,
              lineHeight: SB.RAIL.LABEL_LINE_HEIGHT,
              color: textColor,
              transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}`,
            }}
          >
            {railLabel}
          </span>
        ) : null}
      </NavButton>
    );

    // Always wrapped: a collapse swaps the title instead of remounting every button.
    return (
      <Tooltip
        title={isCollapsed ? text : undefined}
        placement="right"
        mouseEnterDelay={SIDEBAR_LAYOUT.TOOLTIP_DELAY_S}
      >
        {button}
      </Tooltip>
    );
  },
);

SidebarButton.displayName = 'SidebarButton';

export default SidebarButton;
