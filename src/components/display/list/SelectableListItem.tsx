import React from 'react';
import { Checkbox, Tooltip } from 'antd';
import type { SelectableListItemProps } from '../../../interfaces/layout/list';

const SelectableListItem: React.FC<SelectableListItemProps> = ({
  value,
  name,
  description,
  customContent,
  isProtected = false,
  protectionIcon,
  protectionTooltip,
  protectionIconColor,
  protectionIconSize = 18,
  protectionIconPosition = { top: 8, right: 8 },
  itemStyles,
  contentStyles,
  nameStyles,
  descriptionStyles,
  onMouseEnter,
  onMouseLeave,
  className,
  checkboxStyle,
  children,
  disabled = false,
}) => {
  const baseStyles = itemStyles?.base || {};
  const hoverStyles = itemStyles?.hover || {};

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseEnter) {
      onMouseEnter(e);
    } else if (hoverStyles) {
      Object.assign(e.currentTarget.style, hoverStyles);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseLeave) {
      onMouseLeave(e);
    } else if (baseStyles) {
      const backgroundValue = baseStyles.background;
      const borderValue = baseStyles.border;
      if (backgroundValue && typeof backgroundValue === 'string') {
        e.currentTarget.style.background = backgroundValue;
      }
      if (borderValue && typeof borderValue === 'string') {
        e.currentTarget.style.borderColor = borderValue;
      }
    }
  };

  const defaultContentStyles = {
    flex: 1,
    minWidth: 0,
    ...contentStyles,
  };

  const defaultNameStyles = {
    fontSize: 14,
    color: '#0B1F33',
    fontWeight: 500,
    lineHeight: 1.4,
    ...nameStyles,
  };

  const defaultDescriptionStyles = {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 1.3,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
    ...descriptionStyles,
  };

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        width: '100%',
        flexShrink: 0,
        position: 'relative',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isProtected && protectionIcon && (
        <Tooltip title={protectionTooltip || 'This item is protected'}>
          <div
            style={{
              position: 'absolute',
              top: protectionIconPosition.top,
              right: protectionIconPosition.right,
              zIndex: 1,
            }}
          >
            {React.isValidElement(protectionIcon)
              ? React.cloneElement(
                  protectionIcon as React.ReactElement<{ style?: React.CSSProperties }>,
                  {
                    style: {
                      fontSize: protectionIconSize,
                      color: protectionIconColor,
                      ...((protectionIcon as React.ReactElement<{ style?: React.CSSProperties }>)
                        ?.props?.style || {}),
                    },
                  },
                )
              : protectionIcon}
          </div>
        </Tooltip>
      )}
      {disabled ? (
        <div style={{ margin: 0, width: '100%', paddingLeft: 24, ...checkboxStyle }}>
          <div style={defaultContentStyles}>
            {name && <div style={defaultNameStyles}>{name}</div>}
            {description && <div style={defaultDescriptionStyles}>{description}</div>}
            {customContent && <div>{customContent}</div>}
            {children}
          </div>
        </div>
      ) : (
        <Checkbox value={value} style={{ margin: 0, width: '100%', ...checkboxStyle }}>
          <div style={defaultContentStyles}>
            {name && <div style={defaultNameStyles}>{name}</div>}
            {description && <div style={defaultDescriptionStyles}>{description}</div>}
            {customContent && <div>{customContent}</div>}
            {children}
          </div>
        </Checkbox>
      )}
    </div>
  );
};

export default SelectableListItem;
