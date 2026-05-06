import { memo } from 'react';
import type { CSSProperties } from 'react';
import { DEFAULT_COLORS, MENU_LABELS } from '../../../constants';
import {
  HomeMenuButton,
  ApplicationsMenuButton,
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
  padding: '4px 12px 2px 14px',
  marginTop: 20,
  userSelect: 'none',
};

const MenuItems = memo(({ isCollapsed = false }: MenuItemsProps) => {
  return (
    <nav style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <HomeMenuButton isCollapsed={isCollapsed} />
      {!isCollapsed && <div style={sectionLabelStyle}>{MENU_LABELS.RESOURCES}</div>}
      <ApplicationsMenuButton isCollapsed={isCollapsed} />
      {!isCollapsed && (
        <div style={sectionLabelStyle}>{MENU_LABELS.ACCESS_AND_PERMISSIONS}</div>
      )}
      <UsersMenuButton isCollapsed={isCollapsed} />
      <GroupsMenuButton isCollapsed={isCollapsed} />
      <RolesMenuButton isCollapsed={isCollapsed} />
      {!isCollapsed && <div style={sectionLabelStyle}>{MENU_LABELS.GOVERNANCE}</div>}
      <ProtectionPlansMenuButton isCollapsed={isCollapsed} />
    </nav>
  );
});

MenuItems.displayName = 'MenuItems';

export default MenuItems;
