import React from 'react';
import { Dropdown, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  BUTTON_COLORS,
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  DISABLED_OPACITY,
  TOOLBAR_CONTROL,
  TOOLBAR_ITEM_GAP,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  MOTION,
  RADIUS,
  SPACING,
} from '../../../constants';
import type { ToolbarButtonConfig, ToolbarConfig } from '../../../interfaces/layout/toolbar';
import { SearchButton } from '../buttons';
import { FancySpinner } from '../../animation';
import { SearchInput } from '../inputs';
import { useMediaQuery } from '../../../hooks/layout';

// What a button's paint depends on.
interface ButtonLook {
  isPrimary: boolean;
  isDanger: boolean;
  isGhost: boolean;
  isDisabled: boolean;
  active: boolean;
}

const lookOf = (button: ToolbarButtonConfig): ButtonLook => ({
  isPrimary: button.variant === 'primary',
  isDanger: button.variant === 'danger',
  isGhost: button.variant === 'ghost',
  isDisabled: button.disabled ?? false,
  active: button.active ?? false,
});

// A default or ghost button's label: dimmed when disabled, dark on an active (white) button.
const plainTextColor = ({ isDisabled, active }: ButtonLook): string => {
  if (isDisabled) return BUTTON_COLORS.TOOLBAR_DISABLED_TEXT;
  return active ? DEFAULT_COLORS.TEXT_ON_SURFACE : BUTTON_COLORS.TOOLBAR_TEXT;
};

const textColorOf = (look: ButtonLook): string => {
  if (look.isDisabled) return BUTTON_COLORS.TOOLBAR_DISABLED_TEXT;
  if (look.isPrimary) return BUTTON_CONFIGS.PRIMARY_BUTTON.TEXT_COLOR;
  if (look.isDanger) return DEFAULT_COLORS.DANGER;
  return plainTextColor(look);
};

const backgroundOf = ({ isPrimary, isDisabled, active }: ButtonLook): string => {
  if (isPrimary) return isDisabled ? BUTTON_COLORS.TOOLBAR_BORDER : DEFAULT_COLORS.SUCCESS;
  return active ? DEFAULT_COLORS.SURFACE_WHITE : 'transparent';
};

// `activeBorder` is what an active default button draws: a dropdown keeps the plain border.
const borderColorOf = (look: ButtonLook, activeBorder: string): string => {
  if (look.isDisabled && (look.isDanger || look.isPrimary)) return BUTTON_COLORS.TOOLBAR_BORDER;
  if (look.isPrimary) return DEFAULT_COLORS.SUCCESS;
  if (look.isDanger) return DEFAULT_COLORS.DANGER;
  return look.active ? activeBorder : BUTTON_COLORS.TOOLBAR_BORDER;
};

const cursorOf = (isDisabled: boolean, isLoading: boolean): string => {
  if (isDisabled) return 'not-allowed';
  return isLoading ? 'default' : 'pointer';
};

const buttonStyle = (
  look: ButtonLook,
  iconOnly: boolean,
  cursor: string,
  activeBorder: string,
): React.CSSProperties => ({
  all: 'unset',
  cursor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: iconOnly ? 'center' : undefined,
  gap: iconOnly ? SPACING.NONE : SPACING.S6,
  height: TOOLBAR_CONTROL.HEIGHT,
  width: iconOnly ? TOOLBAR_CONTROL.HEIGHT : undefined,
  boxSizing: 'border-box',
  padding: iconOnly ? SPACING.NONE : TOOLBAR_CONTROL.PADDING,
  lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
  borderRadius: RADIUS.SM,
  fontSize: FONT_SIZE.MD,
  fontWeight: look.isPrimary ? BUTTON_CONFIGS.PRIMARY_BUTTON.FONT_WEIGHT : FONT_WEIGHT.MEDIUM,
  border: look.isGhost ? 'none' : `1px solid ${borderColorOf(look, activeBorder)}`,
  backgroundColor: backgroundOf(look),
  color: textColorOf(look),
  opacity: look.isDisabled ? DISABLED_OPACITY : 1,
  transition: `all ${MOTION.BASE_MS}ms`,
});

const paintHover = (el: HTMLElement, look: ButtonLook): void => {
  if (look.isDisabled) return;
  if (look.isPrimary) {
    el.style.opacity = '0.9';
  } else if (look.isDanger && !look.active) {
    el.style.backgroundColor = DEFAULT_COLORS.DANGER_TINT;
  } else if (!look.active) {
    // Ghost buttons invert on hover: white surface (gray on panels), dark label.
    el.style.backgroundColor = BUTTON_COLORS.TOOLBAR_HOVER_BG;
    el.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
    if (!look.isGhost) {
      el.style.borderColor = DEFAULT_COLORS.TEXT_ON_SURFACE;
    }
  }
};

// Restores the rendered look, so a disabled button stays dimmed. Never skipped while disabled: a
// button that disables itself on click would keep the hover surface, its label white on white.
const paintRest = (el: HTMLElement, look: ButtonLook, activeBorder: string): void => {
  if (look.isPrimary) {
    el.style.opacity = String(look.isDisabled ? DISABLED_OPACITY : 1);
  } else if (look.isDanger) {
    el.style.backgroundColor = 'transparent';
  } else {
    el.style.backgroundColor = backgroundOf(look);
    el.style.color = plainTextColor(look);
    if (!look.isGhost) {
      el.style.borderColor = borderColorOf(look, activeBorder);
    }
  }
};

// An icon-only button carries no visible text, so it always needs the tooltip, not just the
// disabled-state explanation.
const tooltipOf = (button: ToolbarButtonConfig, iconOnly: boolean, label: string) => {
  if (iconOnly) return button.tooltip ?? label;
  return button.disabled ? button.tooltip : undefined;
};

const ICON_STYLE: React.CSSProperties = {
  fontSize: FONT_SIZE.BASE,
  display: 'flex',
  alignItems: 'center',
  lineHeight: LINE_HEIGHT.NONE,
};

interface ToolbarButtonProps {
  button: ToolbarButtonConfig;
  label: string;
  iconOnly: boolean;
  onClick: () => void;
}

const DropdownButton: React.FC<ToolbarButtonProps> = ({ button, label, iconOnly, onClick }) => {
  const look = lookOf(button);
  const activeBorder = BUTTON_COLORS.TOOLBAR_BORDER;
  return (
    <Dropdown
      menu={{
        items: button.dropdown?.items,
        onClick: ({ key }) => {
          button.dropdown?.onItemClick?.(key);
        },
        selectedKeys: button.dropdown?.selectedKeys,
      }}
      trigger={['click']}
      disabled={look.isDisabled}
    >
      <button
        disabled={look.isDisabled}
        aria-label={iconOnly ? label : undefined}
        style={buttonStyle(look, iconOnly, cursorOf(look.isDisabled, false), activeBorder)}
        onClick={look.isDisabled ? undefined : onClick}
        onMouseEnter={(e) => paintHover(e.currentTarget, look)}
        onMouseLeave={(e) => paintRest(e.currentTarget, look, activeBorder)}
      >
        {button.icon && <span style={ICON_STYLE}>{button.icon}</span>}
        {!iconOnly && (
          <>
            <span>{label}</span>
            <DownOutlined style={{ fontSize: FONT_SIZE.XXS }} />
          </>
        )}
      </button>
    </Dropdown>
  );
};

const ActionButton: React.FC<ToolbarButtonProps> = ({ button, label, iconOnly, onClick }) => {
  const look = lookOf(button);
  const isLoading = button.loading ?? false;
  const activeBorder = DEFAULT_COLORS.TEXT_ON_SURFACE;
  const icon = button.icon && <span style={ICON_STYLE}>{button.icon}</span>;
  return (
    <button
      onClick={onClick}
      disabled={look.isDisabled}
      aria-label={iconOnly ? label : undefined}
      style={buttonStyle(look, iconOnly, cursorOf(look.isDisabled, isLoading), activeBorder)}
      onMouseEnter={(e) => paintHover(e.currentTarget, look)}
      onMouseLeave={(e) => paintRest(e.currentTarget, look, activeBorder)}
    >
      {isLoading ? <FancySpinner size={14} color="currentColor" /> : icon}
      {!iconOnly && <span>{label}</span>}
    </button>
  );
};

interface ToolbarProps {
  config: ToolbarConfig | undefined;
  /** Set by a parent that measures its own width; falls back to the viewport. */
  compact?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ config, compact }) => {
  const buttons = config?.buttons ?? [];
  const search = config?.search;
  const [showSearch, setShowSearch] = React.useState(false);
  const isViewportCompact = useMediaQuery(TOOLBAR_CONTROL.COMPACT_QUERY);
  const isCompact = compact ?? isViewportCompact;

  const handleSearchToggle = React.useCallback(() => {
    if (!search) return;
    setShowSearch((prev) => !prev);
  }, [search]);

  if (!config) return null;

  const withTooltip = (node: React.ReactNode, tooltip?: string, key?: string) => {
    if (!tooltip) return <React.Fragment key={key}>{node}</React.Fragment>;
    return (
      <Tooltip key={key} title={tooltip}>
        <span style={{ display: 'inline-flex' }}>{node}</span>
      </Tooltip>
    );
  };

  return (
    // The collapsed search sits outside the gap: a zero-width flex child still
    // takes one, which would space each toolbar differently depending on
    // whether it owns a search. Its own margin spaces it only once open.
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {search && (
        <div
          style={{
            // Clipped for the slide-open, with room for the input's keyboard focus ring.
            overflow: 'clip',
            overflowClipMargin: 4,
            maxWidth: showSearch ? 300 : 0,
            opacity: showSearch ? 1 : 0,
            marginRight: showSearch ? TOOLBAR_ITEM_GAP : SPACING.NONE,
            transition: `max-width ${MOTION.SLOW_MS}ms ${MOTION.EASE_STANDARD}, opacity ${MOTION.SLOW_MS}ms ${MOTION.EASE_STANDARD}`,
            width: showSearch ? 'auto' : 0,
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            <SearchInput
              value={search.value}
              onChange={search.onChange}
              placeholder={search.placeholder ?? 'Search'}
              onSubmit={search.onSubmit}
              maxLength={search.maxLength}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: TOOLBAR_ITEM_GAP }}>
        {buttons.map((button) => {
          const isDisabled = button.disabled ?? false;
          const isLoading = button.loading ?? false;
          const isSearchButton = search && button.key === 'search';
          const label = isSearchButton && showSearch ? 'Hide' : button.label;
          // A label with no icon to fall back on would leave an empty button.
          const iconOnly = (button.iconOnly ?? false) || (isCompact && Boolean(button.icon));

          const handleButtonClick = () => {
            // A button left enabled while its action is in flight would re-fire it.
            if (isDisabled || isLoading) return;
            if (isSearchButton) handleSearchToggle();
            button.onClick?.();
          };

          if (isSearchButton) {
            return withTooltip(
              <SearchButton
                key={button.key}
                onClick={handleButtonClick}
                label={label}
                disabled={isDisabled}
                active={showSearch}
                compact={isCompact}
              />,
              isDisabled ? button.tooltip : undefined,
              button.key,
            );
          }

          const props = { button, label, iconOnly, onClick: handleButtonClick };
          const node = button.dropdown ? (
            <DropdownButton key={button.key} {...props} />
          ) : (
            // A fresh node when it disables itself on click: the hover paint would stay (Chrome sends
            // a disabled button no mouseleave) under the disabled label, white on white.
            <ActionButton key={`${button.key}:${isDisabled}`} {...props} />
          );
          return withTooltip(node, tooltipOf(button, iconOnly, label), button.key);
        })}
      </div>
    </div>
  );
};

export default Toolbar;
