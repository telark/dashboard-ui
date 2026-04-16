import React from 'react';
import { Dropdown, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';
import type { ToolbarConfig } from '../../../interfaces/layout/toolbar';
import { SearchButton } from '../buttons';
import { SearchInput } from '../inputs';

interface ToolbarProps {
  config: ToolbarConfig | undefined;
}

const Toolbar: React.FC<ToolbarProps> = ({ config }) => {
  const buttons = config?.buttons ?? [];
  const search = config?.search;
  const [showSearch, setShowSearch] = React.useState(false);

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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          maxWidth: showSearch && search ? 300 : 0,
          opacity: showSearch && search ? 1 : 0,
          transition:
            'max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: showSearch && search ? 'auto' : 0,
        }}
      >
        {search && (
          <div style={{ whiteSpace: 'nowrap' }}>
            <SearchInput
              value={search.value}
              onChange={search.onChange}
              placeholder={search.placeholder ?? 'Search'}
              onSubmit={search.onSubmit}
            />
          </div>
        )}
      </div>

      {buttons.map((button) => {
        const isPrimary = button.variant === 'primary';
        const isDanger = button.variant === 'danger';
        const isGhost = button.variant === 'ghost';
        const isDisabled = button.disabled ?? false;
        const isSearchButton = search && button.key === 'search';
        const buttonLabel = isSearchButton && showSearch ? 'Hide' : button.label;

        const handleButtonClick = () => {
          if (isDisabled) return;
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
              }}
              trigger={['click']}
              disabled={isDisabled}
            >
              <button
                disabled={isDisabled}
                style={{
                  all: 'unset',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: isGhost ? '6px 12px' : '6px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  border: isGhost
                    ? 'none'
                    : `1px solid ${
                        isDisabled && isDanger
                          ? '#d9d9d9'
                          : isPrimary
                            ? DEFAULT_COLORS.SUCCESS
                            : isDanger
                              ? DEFAULT_COLORS.DANGER
                              : '#d9d9d9'
                      }`,
                  backgroundColor: isPrimary
                    ? DEFAULT_COLORS.SUCCESS
                    : button.active
                      ? '#e6f7ff'
                      : 'transparent',
                  color: isDisabled
                    ? '#d1d5db'
                    : isPrimary
                      ? '#fff'
                      : isDanger
                        ? DEFAULT_COLORS.DANGER
                        : '#64748b',
                  opacity: isDisabled ? 0.6 : 1,
                  fontFamily: "'Roboto Condensed', sans-serif",
                  transition: 'all 0.2s',
                }}
                onClick={isDisabled ? undefined : handleButtonClick}
                onMouseEnter={(e) => {
                  if (isDisabled) return;
                  if (isPrimary) {
                    e.currentTarget.style.opacity = '0.9';
                  } else if (isDanger && !button.active) {
                    e.currentTarget.style.backgroundColor = '#fff1f0';
                  } else if (!button.active) {
                    e.currentTarget.style.backgroundColor = DEFAULT_COLORS.HOVER_BG;
                    if (!isGhost) {
                      e.currentTarget.style.borderColor = DEFAULT_COLORS.SUCCESS;
                      e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (isDisabled) return;
                  if (isPrimary) {
                    e.currentTarget.style.opacity = '1';
                  } else if (isDanger) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  } else {
                    e.currentTarget.style.backgroundColor = button.active
                      ? '#e6f7ff'
                      : 'transparent';
                    if (!isGhost) {
                      e.currentTarget.style.borderColor = '#d9d9d9';
                      e.currentTarget.style.color = '#64748b';
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
                <span>{buttonLabel}</span>
                <DownOutlined style={{ fontSize: 10 }} />
              </button>
            </Dropdown>
          );
          return withTooltip(dropdownNode, isDisabled ? button.tooltip : undefined, button.key);
        }

        const buttonNode = (
          <button
            key={button.key}
            onClick={handleButtonClick}
            disabled={isDisabled}
            style={{
              all: 'unset',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: isGhost ? '6px 12px' : '6px 16px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              border: isGhost
                ? 'none'
                : `1px solid ${
                    isDisabled && isDanger
                      ? '#d9d9d9'
                      : isPrimary
                        ? DEFAULT_COLORS.SUCCESS
                        : isDanger
                          ? DEFAULT_COLORS.DANGER
                          : '#d9d9d9'
                  }`,
              backgroundColor: isPrimary
                ? DEFAULT_COLORS.SUCCESS
                : button.active
                  ? '#e6f7ff'
                  : 'transparent',
              color: isDisabled
                ? '#d1d5db'
                : isPrimary
                  ? '#fff'
                  : isDanger
                    ? DEFAULT_COLORS.DANGER
                    : '#64748b',
              opacity: isDisabled ? 0.6 : 1,
              fontFamily: "'Roboto Condensed', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (isDisabled) return;
              if (isPrimary) {
                e.currentTarget.style.opacity = '0.9';
              } else if (isDanger && !button.active) {
                e.currentTarget.style.backgroundColor = '#fff1f0';
              } else if (!button.active) {
                e.currentTarget.style.backgroundColor = isGhost ? '#f5f5f5' : '#f5f5f5';
                if (!isGhost) {
                  e.currentTarget.style.borderColor = DEFAULT_COLORS.SUCCESS;
                  e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
                }
              }
            }}
            onMouseLeave={(e) => {
              if (isDisabled) return;
              if (isPrimary) {
                e.currentTarget.style.opacity = '1';
              } else if (isDanger) {
                e.currentTarget.style.backgroundColor = 'transparent';
              } else {
                e.currentTarget.style.backgroundColor = button.active ? '#e6f7ff' : 'transparent';
                if (!isGhost) {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                  e.currentTarget.style.color = '#64748b';
                }
              }
            }}
          >
            {button.icon && (
              <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                {button.icon}
              </span>
            )}
            <span>{buttonLabel}</span>
          </button>
        );
        return withTooltip(buttonNode, isDisabled ? button.tooltip : undefined, button.key);
      })}
    </div>
  );
};

export default Toolbar;
