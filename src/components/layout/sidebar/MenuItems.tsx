import { memo } from 'react';
import type { CSSProperties } from 'react';
import { BUTTON_CONFIGS, DEFAULT_COLORS, MENU_LABELS } from '../../../constants';
import {
  HomeMenuButton,
  ApplicationsMenuButton,
  InsightsMenuButton,
  UsersMenuButton,
  GroupsMenuButton,
  RolesMenuButton,
  ProtectionPlansMenuButton,
} from './MenuButtons';

interface MenuItemsProps {
  isCollapsed?: boolean;
}

const sectionLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: DEFAULT_COLORS.ICON_SECONDARY,
  padding: '4px 12px 2px 22px',
  marginTop: 20,
  userSelect: 'none',
};

const MenuItems = memo(({ isCollapsed = false }: MenuItemsProps) => {
  return (
    <nav
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: BUTTON_CONFIGS.SIDEBAR_BUTTON.ITEM_GAP_PX,
      }}
    >
      <HomeMenuButton isCollapsed={isCollapsed} />
      {!isCollapsed && <div style={sectionLabelStyle}>{MENU_LABELS.DISCOVERY}</div>}
      <ApplicationsMenuButton isCollapsed={isCollapsed} />
      <InsightsMenuButton isCollapsed={isCollapsed} />
      <ProtectionPlansMenuButton isCollapsed={isCollapsed} />
      {!isCollapsed && <div style={sectionLabelStyle}>{MENU_LABELS.ACCESS_AND_PERMISSIONS}</div>}
      <UsersMenuButton isCollapsed={isCollapsed} />
      <GroupsMenuButton isCollapsed={isCollapsed} />
      <RolesMenuButton isCollapsed={isCollapsed} />
    </nav>
  );
});

MenuItems.displayName = 'MenuItems';

export default MenuItems;
