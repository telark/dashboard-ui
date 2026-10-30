import type { MenuProps } from 'antd';
import { LockOutlined, LogoutOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import { APP_ROUTES, HEADER_CONSTANTS } from '../../../../../constants';

interface UserMenuItemsProps {
  onNavigate: (route: string) => void;
  onLogout: () => void;
  loggingOut: boolean;
}

const { TEXTS } = HEADER_CONSTANTS.USER.MENU;
const iconStyle = { color: HEADER_CONSTANTS.USER.MENU_ICON_COLOR };

const SHORTCUTS = [
  {
    key: 'profile',
    label: TEXTS.PROFILE,
    icon: <UserOutlined style={iconStyle} />,
    slug: 'profile',
  },
  {
    key: 'security',
    label: TEXTS.SECURITY,
    icon: <SafetyOutlined style={iconStyle} />,
    slug: 'security',
  },
  {
    key: 'permissions',
    label: TEXTS.MY_PERMISSIONS,
    icon: <LockOutlined style={iconStyle} />,
    slug: 'permissions',
  },
];

export const createUserMenuItems = ({
  onNavigate,
  onLogout,
  loggingOut,
}: UserMenuItemsProps): MenuProps['items'] => [
  ...SHORTCUTS.map(({ key, label, icon, slug }) => ({
    key,
    label,
    icon,
    onClick: () => onNavigate(`${APP_ROUTES.SETTINGS}/${slug}`),
  })),
  { type: 'divider' },
  {
    key: 'logout',
    label: TEXTS.LOGOUT,
    icon: <LogoutOutlined style={iconStyle} />,
    onClick: onLogout,
    disabled: loggingOut,
  },
];
