import React from 'react';
import { Dropdown, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  BUTTON_COLORS,
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  TOOLBAR_CONTROL,
  TOOLBAR_ITEM_GAP,
} from '../../../constants';
import type { ToolbarConfig } from '../../../interfaces/layout/toolbar';
import { SearchButton } from '../buttons';
import { FancySpinner } from '../../animation';
import { SearchInput } from '../inputs';
import { useMediaQuery } from '../../../hooks/layout';

const DISABLED_OPACITY = 0.6;

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
            overflow: 'hidden',
            maxWidth: showSearch ? 300 : 0,
            opacity: showSearch ? 1 : 0,
            marginRight: showSearch ? TOOLBAR_ITEM_GAP : 0,
            transition:
              'max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: showSearch ? 'auto' : 0,
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            <SearchInput
              value={search.value}
              onChange={search.onChange}
              placeholder={search.placeholder ?? 'Search'}
              onSubmit={search.onSubmit}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: TOOLBAR_ITEM_GAP }}>
        {buttons.map((button) => {
          const isPrimary = button.variant === 'primary';
          const isDanger = button.variant === 'danger';
          const isGhost = button.variant === 'ghost';
          const isDisabled = button.disabled ?? false;
          const isLoading = button.loading ?? false;
          const isSearchButton = search && button.key === 'search';
          const buttonLabel = isSearchButton && showSearch ? 'Hide' : button.label;
          // A label with no icon to fall back on would leave an empty button.
          const iconOnly = (button.iconOnly ?? false) || (isCompact && Boolean(button.icon));

          const handleButtonClick = () => {
            // A button left enabled while its action is in flight would re-fire it.
            if (isDisabled || isLoading) return;
            if (search && button.key === 'search') {
              handleSearchToggle();
            }
            button.onClick?.();
          };

          if (isSearchButton) {
            return withTooltip(
              <SearchButton
                key={button.key}
                onClick={handleButtonClick}
                label={buttonLabel}
                disabled={isDisabled}
                active={showSearch}
                compact={isCompact}
              />,
              isDisabled ? button.tooltip : undefined,
              button.key,
            );
          }

          if (button.dropdown) {
            const dropdownNode = (
              <Dropdown
                key={button.key}
                menu={{
                  items: button.dropdown.items,
                  onClick: ({ key }) => {
                    button.dropdown?.onItemClick?.(key);
                  },
                  selectedKeys: button.dropdown.selectedKeys,
                }}
                trigger={['click']}
                disabled={isDisabled}
              >
                <button
                  disabled={isDisabled}
                  aria-label={iconOnly ? buttonLabel : undefined}
                  style={{
                    all: 'unset',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: iconOnly ? 'center' : undefined,
                    gap: iconOnly ? 0 : 6,
                    height: TOOLBAR_CONTROL.HEIGHT,
                    width: iconOnly ? TOOLBAR_CONTROL.HEIGHT : undefined,
                    boxSizing: 'border-box',
                    padding: iconOnly ? 0 : TOOLBAR_CONTROL.PADDING,
                    lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: isPrimary ? BUTTON_CONFIGS.PRIMARY_BUTTON.FONT_WEIGHT : 500,
                    border: isGhost
                      ? 'none'
                      : `1px solid ${
                          isDisabled && isDanger
                            ? BUTTON_COLORS.TOOLBAR_BORDER
                            : isPrimary
                              ? DEFAULT_COLORS.SUCCESS
                              : isDanger
                                ? DEFAULT_COLORS.DANGER
                                : BUTTON_COLORS.TOOLBAR_BORDER
                        }`,
                    backgroundColor: isPrimary
                      ? DEFAULT_COLORS.SUCCESS
                      : button.active
                        ? DEFAULT_COLORS.SURFACE_WHITE
                        : 'transparent',
                    color: isDisabled
                      ? BUTTON_COLORS.TOOLBAR_DISABLED_TEXT
                      : isPrimary
                        ? BUTTON_CONFIGS.PRIMARY_BUTTON.TEXT_COLOR
                        : isDanger
                          ? DEFAULT_COLORS.DANGER
                          : button.active
                            ? DEFAULT_COLORS.TEXT_ON_SURFACE
                            : BUTTON_COLORS.TOOLBAR_TEXT,
                    opacity: isDisabled ? DISABLED_OPACITY : 1,
                    transition: 'all 0.2s',
                  }}
                  onClick={isDisabled ? undefined : handleButtonClick}
                  onMouseEnter={(e) => {
                    if (isDisabled) return;
                    if (isPrimary) {
                      e.currentTarget.style.opacity = '0.9';
                    } else if (isDanger && !button.active) {
                      e.currentTarget.style.backgroundColor = DEFAULT_COLORS.DANGER_TINT;
                    } else if (!button.active) {
                      // Ghost buttons invert on hover: white surface, dark label.
                      e.currentTarget.style.backgroundColor = DEFAULT_COLORS.SURFACE_WHITE;
                      e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
                      if (!isGhost) {
                        e.currentTarget.style.borderColor = DEFAULT_COLORS.TEXT_ON_SURFACE;
                      }
                    }
                  }}
                  // Never skipped while disabled: a button that disables itself on
                  // click would keep the hover surface and render its label white on white.
                  onMouseLeave={(e) => {
                    if (isPrimary) {
                      e.currentTarget.style.opacity = String(isDisabled ? DISABLED_OPACITY : 1);
                    } else if (isDanger) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    } else {
                      e.currentTarget.style.backgroundColor = button.active
                        ? DEFAULT_COLORS.SURFACE_WHITE
                        : 'transparent';
                      e.currentTarget.style.color = isDisabled
                        ? BUTTON_COLORS.TOOLBAR_DISABLED_TEXT
                        : button.active
                          ? DEFAULT_COLORS.TEXT_ON_SURFACE
                          : BUTTON_COLORS.TOOLBAR_TEXT;
                      if (!isGhost) {
                        e.currentTarget.style.borderColor = BUTTON_COLORS.TOOLBAR_BORDER;
                      }
                    }
                  }}
                >
                  {button.icon && (
                    <span
                      style={{ fontSize: 14, display: 'flex', alignItems: 'center', lineHeight: 1 }}
                    >
                      {button.icon}
                    </span>
                  )}
                  {!iconOnly && (
                    <>
                      <span>{buttonLabel}</span>
                      <DownOutlined style={{ fontSize: 10 }} />
                    </>
                  )}
                </button>
              </Dropdown>
            );
            return withTooltip(
              dropdownNode,
              iconOnly ? (button.tooltip ?? buttonLabel) : isDisabled ? button.tooltip : undefined,
              button.key,
            );
          }

          const buttonNode = (
            <button
              key={button.key}
              onClick={handleButtonClick}
              disabled={isDisabled}
              aria-label={iconOnly ? buttonLabel : undefined}
              style={{
                all: 'unset',
                cursor: isDisabled ? 'not-allowed' : isLoading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: iconOnly ? 'center' : undefined,
                gap: iconOnly ? 0 : 6,
                height: TOOLBAR_CONTROL.HEIGHT,
                width: iconOnly ? TOOLBAR_CONTROL.HEIGHT : undefined,
                boxSizing: 'border-box',
                padding: iconOnly ? 0 : TOOLBAR_CONTROL.PADDING,
                lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
                borderRadius: 6,
                fontSize: 13,
                fontWeight: isPrimary ? BUTTON_CONFIGS.PRIMARY_BUTTON.FONT_WEIGHT : 500,
                border: isGhost
                  ? 'none'
                  : `1px solid ${
                      isDisabled && isDanger
                        ? BUTTON_COLORS.TOOLBAR_BORDER
                        : isPrimary
                          ? DEFAULT_COLORS.SUCCESS
                          : isDanger
                            ? DEFAULT_COLORS.DANGER
                            : button.active
                              ? DEFAULT_COLORS.TEXT_ON_SURFACE
                              : BUTTON_COLORS.TOOLBAR_BORDER
                    }`,
                backgroundColor: isPrimary
                  ? DEFAULT_COLORS.SUCCESS
                  : button.active
                    ? DEFAULT_COLORS.SURFACE_WHITE
                    : 'transparent',
                color: isDisabled
                  ? BUTTON_COLORS.TOOLBAR_DISABLED_TEXT
                  : isPrimary
                    ? BUTTON_CONFIGS.PRIMARY_BUTTON.TEXT_COLOR
                    : isDanger
                      ? DEFAULT_COLORS.DANGER
                      : button.active
                        ? DEFAULT_COLORS.TEXT_ON_SURFACE
                        : BUTTON_COLORS.TOOLBAR_TEXT,
                opacity: isDisabled ? DISABLED_OPACITY : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (isDisabled) return;
                if (isPrimary) {
                  e.currentTarget.style.opacity = '0.9';
                } else if (isDanger && !button.active) {
                  e.currentTarget.style.backgroundColor = DEFAULT_COLORS.DANGER_TINT;
                } else if (!button.active) {
                  // Ghost buttons invert on hover: white surface, dark label.
                  e.currentTarget.style.backgroundColor = DEFAULT_COLORS.SURFACE_WHITE;
                  e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
                  if (!isGhost) {
                    e.currentTarget.style.borderColor = DEFAULT_COLORS.TEXT_ON_SURFACE;
                  }
                }
              }}
              // Restores the rendered look, so a disabled button stays dimmed.
              onMouseLeave={(e) => {
                if (isPrimary) {
                  e.currentTarget.style.opacity = String(isDisabled ? DISABLED_OPACITY : 1);
                } else if (isDanger) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                } else {
                  e.currentTarget.style.backgroundColor = button.active
                    ? DEFAULT_COLORS.SURFACE_WHITE
                    : 'transparent';
                  e.currentTarget.style.color = isDisabled
                    ? BUTTON_COLORS.TOOLBAR_DISABLED_TEXT
                    : button.active
                      ? DEFAULT_COLORS.TEXT_ON_SURFACE
                      : BUTTON_COLORS.TOOLBAR_TEXT;
                  if (!isGhost) {
                    e.currentTarget.style.borderColor = button.active
                      ? DEFAULT_COLORS.TEXT_ON_SURFACE
                      : BUTTON_COLORS.TOOLBAR_BORDER;
                  }
                }
              }}
            >
              {isLoading ? (
                <FancySpinner size={14} color="currentColor" />
              ) : (
                button.icon && (
                  <span
                    style={{ fontSize: 14, display: 'flex', alignItems: 'center', lineHeight: 1 }}
                  >
                    {button.icon}
                  </span>
                )
              )}
              {!iconOnly && <span>{buttonLabel}</span>}
            </button>
          );
          // An icon-only button carries no visible text, so it always needs the
          // tooltip, not just the disabled-state explanation.
          const tooltipTitle = iconOnly
            ? (button.tooltip ?? buttonLabel)
            : isDisabled
              ? button.tooltip
              : undefined;
          return withTooltip(buttonNode, tooltipTitle, button.key);
        })}
      </div>
    </div>
  );
};

export default Toolbar;
