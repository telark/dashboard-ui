import { memo } from 'react';
import { BUTTON_CONFIGS, MENU_LABELS } from '../../../constants';
import SidebarSectionLabel from './SidebarSectionLabel';
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
      <SidebarSectionLabel label={MENU_LABELS.OPERATIONS} isCollapsed={isCollapsed} />
      <ApplicationsMenuButton isCollapsed={isCollapsed} />
      <ProtectionPlansMenuButton isCollapsed={isCollapsed} />
      <InsightsMenuButton isCollapsed={isCollapsed} />
      <SidebarSectionLabel label={MENU_LABELS.ADMINISTRATION} isCollapsed={isCollapsed} />
      <UsersMenuButton isCollapsed={isCollapsed} />
      <GroupsMenuButton isCollapsed={isCollapsed} />
      <RolesMenuButton isCollapsed={isCollapsed} />
      <SettingsMenuButton isCollapsed={isCollapsed} />
    </nav>
  );
});

MenuItems.displayName = 'MenuItems';

export default MenuItems;
