import React from 'react';
import { DEFAULT_COLORS, DISABLED_CONTENT_OPACITY } from '../../../constants';
import { Checkbox } from 'antd';
import type { SelectableListItemProps } from '../../../interfaces/layout/list';

const SelectableListItem: React.FC<SelectableListItemProps> = ({
  value,
  name,
  description,
  customContent,
  protectionBadge,
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
  disabledReason,
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
    color: DEFAULT_COLORS.TEXT_ON_SURFACE,
    fontWeight: 500,
    lineHeight: 1.4,
    ...nameStyles,
  };

  const defaultDescriptionStyles = {
    fontSize: 12,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    marginTop: 2,
    lineHeight: 1.3,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
    ...descriptionStyles,
  };

  const content = (
    <div style={defaultContentStyles}>
      <div style={disabled ? { opacity: DISABLED_CONTENT_OPACITY } : undefined}>
        {name && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={defaultNameStyles}>{name}</div>
            {protectionBadge}
          </div>
        )}
        {description && <div style={defaultDescriptionStyles}>{description}</div>}
        {customContent && <div>{customContent}</div>}
        {children}
      </div>
      {disabled && disabledReason ? (
        <div style={{ ...defaultDescriptionStyles, marginTop: 6, whiteSpace: 'normal' }}>
          {disabledReason}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        width: '100%',
        flexShrink: 0,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {disabled ? (
        <div style={{ margin: 0, width: '100%', paddingLeft: 24, ...checkboxStyle }}>
          {/* Keeps the value registered: the group drops unregistered ones on any toggle. */}
          <Checkbox value={value} disabled style={{ display: 'none' }} />
          {content}
        </div>
      ) : (
        <Checkbox
          value={value}
          style={{ margin: 0, width: '100%', ...checkboxStyle }}
          // The label fills the card, so a badge at the end of the name row sits at its right edge.
          styles={{ label: { flex: 1, minWidth: 0 } }}
        >
          {content}
        </Checkbox>
      )}
    </div>
  );
};

export default SelectableListItem;
