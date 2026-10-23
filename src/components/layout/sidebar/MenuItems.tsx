import { memo } from 'react';
import { BUTTON_CONFIGS, MENU_LABELS, SIDEBAR_LAYOUT } from '../../../constants';
import {
  HomeMenuButton,
  ApplicationsMenuButton,
  InsightsMenuButton,
  UsersMenuButton,
  GroupsMenuButton,
  RolesMenuButton,
  ProtectionPlansMenuButton,
  SettingsMenuButton,
} from './MenuButtons';

interface MenuItemsProps {
  isCollapsed?: boolean;
}

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
      {!isCollapsed && <div style={SIDEBAR_LAYOUT.SECTION_LABEL}>{MENU_LABELS.OPERATIONS}</div>}
      <ApplicationsMenuButton isCollapsed={isCollapsed} />
      <ProtectionPlansMenuButton isCollapsed={isCollapsed} />
      <InsightsMenuButton isCollapsed={isCollapsed} />
      {!isCollapsed && <div style={SIDEBAR_LAYOUT.SECTION_LABEL}>{MENU_LABELS.ADMINISTRATION}</div>}
      <UsersMenuButton isCollapsed={isCollapsed} />
      <GroupsMenuButton isCollapsed={isCollapsed} />
      <RolesMenuButton isCollapsed={isCollapsed} />
      <SettingsMenuButton isCollapsed={isCollapsed} />
    </nav>
  );
});

MenuItems.displayName = 'MenuItems';

export default MenuItems;
