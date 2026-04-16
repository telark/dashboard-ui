import React, { memo, useCallback, useState, useMemo } from 'react';
import { SETTINGS_CONSTANTS, SETTINGS_SECTIONS_LIST } from '../constants';
import type { SettingsSectionKey } from '../constants';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_COLORS } from '../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';

const { SIDEBAR } = SETTINGS_CONSTANTS;
const SB = BUTTON_CONFIGS.SIDEBAR_BUTTON;
const HEADER_OFFSET_PX = PAGE_CONTENT_LAYOUT.HEADER_OFFSET_PX;

const ITEM_GAP_PX = 10;
/** No top margin so first item is flush with sidebar top; bar at sidebar left so no left margin. */
const ITEM_MARGIN = '0 12px 10px 0';
/** Space between selection bar and icon. */
const BAR_TO_CONTENT_GAP = 8;

interface SettingsSidebarProps {
  activeSection: SettingsSectionKey;
  onSectionChange: (key: SettingsSectionKey) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = memo(
  ({ activeSection, onSectionChange }) => {
    const wrapperStyle = useMemo(
      () => ({
        position: 'fixed' as const,
        right: 0,
        top: HEADER_OFFSET_PX,
        width: SIDEBAR.WIDTH,
        height: `calc(100vh - ${HEADER_OFFSET_PX}px)`,
        backgroundColor: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderLeft: SIDEBAR.BORDER_RIGHT,
        zIndex: 1,
        overflowY: 'auto' as const,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 12,
        paddingBottom: 24,
        display: 'flex' as const,
        flexDirection: 'column' as const,
        alignItems: 'stretch' as const,
      }),
      [],
    );

    return (
      <aside style={wrapperStyle}>
        <nav style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <SettingsSidebarGroup
            title="Personal"
            sections={SETTINGS_SECTIONS_LIST.filter(
              (section) => section.key === 'profile' || section.key === 'appearance',
            )}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
          <div
            style={{
              margin: '4px 0 12px 9.5px',
              borderTop: '1px solid #e2e8f0',
              width: `calc(100% - 9.5px)`,
            }}
          />
          <SettingsSidebarGroup
            title="Platform"
            sections={SETTINGS_SECTIONS_LIST.filter(
              (section) =>
                section.key === 'security' ||
                section.key === 'aiInsights' ||
                section.key === 'insightsGovernance',
            )}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        </nav>
      </aside>
    );
  },
);

SettingsSidebar.displayName = 'SettingsSidebar';

interface GroupProps {
  title: string;
  sections: (typeof SETTINGS_SECTIONS_LIST)[number][];
  activeSection: SettingsSectionKey;
  onSectionChange: (key: SettingsSectionKey) => void;
}

const SettingsSidebarGroup: React.FC<GroupProps> = memo(
  ({ title, sections, activeSection, onSectionChange }) => {
    return (
      <div>
        <div
          style={{
            paddingLeft: SB.BORDER_WIDTH + BAR_TO_CONTENT_GAP,
            marginLeft: 0,
            marginBottom: 4,
            color: DEFAULT_COLORS.TEXT_MUTED,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {title}
        </div>
        {sections.map((section) => (
          <SettingsSidebarItem
            key={section.key}
            section={section}
            isActive={activeSection === section.key}
            onSelect={() => onSectionChange(section.key)}
          />
        ))}
      </div>
    );
  },
);

SettingsSidebarGroup.displayName = 'SettingsSidebarGroup';

interface ItemProps {
  section: (typeof SETTINGS_SECTIONS_LIST)[number];
  isActive: boolean;
  onSelect: () => void;
}

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
      gap: ITEM_GAP_PX,
      width: '100%' as const,
      height: SB.HEIGHT,
      padding: `12px 10px 12px ${SB.BORDER_WIDTH + BAR_TO_CONTENT_GAP}px`,
      margin: ITEM_MARGIN,
      border: 'none' as const,
      outline: 'none' as const,
      borderRadius: SB.BORDER_RADIUS,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
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
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          minWidth: 0,
        }}
      >
        {section.label}
      </span>
    </button>
  );
});

SettingsSidebarItem.displayName = 'SettingsSidebarItem';

export default SettingsSidebar;
