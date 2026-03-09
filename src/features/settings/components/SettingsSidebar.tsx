import React, { memo, useCallback, useState, useMemo } from 'react';
import { SETTINGS_CONSTANTS, SETTINGS_SECTIONS_LIST } from '../constants';
import type { SettingsSectionKey } from '../constants';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_COLORS } from '../../../constants';

const { SIDEBAR } = SETTINGS_CONSTANTS;
const SB = BUTTON_CONFIGS.SIDEBAR_BUTTON;

interface SettingsSidebarProps {
  activeSection: SettingsSectionKey;
  onSectionChange: (key: SettingsSectionKey) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = memo(
  ({ activeSection, onSectionChange }) => {
    const navStyle = useMemo(
      () => ({
        width: SIDEBAR.WIDTH,
        flexShrink: 0 as const,
        backgroundColor: DEFAULT_COLORS.BACKGROUND_WHITE,
        paddingTop: 0,
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingBottom: 24,
      }),
      [],
    );

    return (
      <nav style={navStyle}>
        {SETTINGS_SECTIONS_LIST.map((section) => (
          <SettingsSidebarItem
            key={section.key}
            section={section}
            isActive={activeSection === section.key}
            onSelect={() => onSectionChange(section.key)}
          />
        ))}
      </nav>
    );
  },
);

SettingsSidebar.displayName = 'SettingsSidebar';

interface ItemProps {
  section: (typeof SETTINGS_SECTIONS_LIST)[number];
  isActive: boolean;
  onSelect: () => void;
}

/** Same as app sidebar EXPANDED_MARGIN but mirrored for right sidebar (bar on left). */
const ITEM_MARGIN = '10px 0 10px -12px';

const SettingsSidebarItem: React.FC<ItemProps> = memo(({ section, isActive, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = section.icon;
  const isActiveOrHovered = isActive || hovered;
  const iconColor = isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : BUTTON_COLORS.ICON_DEFAULT;
  const textColor = isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : BUTTON_COLORS.TEXT_DEFAULT;

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  const buttonStyle = useMemo(
    () => ({
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: 10,
      width: '100%' as const,
      height: SB.HEIGHT,
      padding: SB.PADDING,
      margin: ITEM_MARGIN,
      border: 'none' as const,
      outline: 'none' as const,
      borderRadius: SB.BORDER_RADIUS,
      backgroundColor: 'transparent' as const,
      color: textColor,
      fontWeight: SB.FONT_WEIGHT,
      fontSize: SB.FONT_SIZE,
      cursor: 'pointer' as const,
      textAlign: 'left' as const,
      transition: SB.TRANSITION,
      boxSizing: 'border-box' as const,
      position: 'relative' as const,
    }),
    [textColor],
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={buttonStyle}
    >
      {isActive && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: SB.BORDER_WIDTH,
            backgroundColor: DEFAULT_COLORS.SUCCESS,
            pointerEvents: 'none',
          }}
        />
      )}
      <Icon
        style={{
          color: iconColor,
          fontSize: 18,
          width: 18.5,
          height: 18.5,
          flexShrink: 0,
        }}
      />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {section.label}
      </span>
    </button>
  );
});

SettingsSidebarItem.displayName = 'SettingsSidebarItem';

export default SettingsSidebar;
