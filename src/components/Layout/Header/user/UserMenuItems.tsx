import { message } from 'antd';
import type { MenuProps } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, HEADER_CONSTANTS } from '../../../../constants';
import type { User as AuthUser } from '../../features/auth/models/credentials';
import type { User as UsersUser } from '../../../../interfaces/resources/users';

interface UserMenuItemsProps {
  currentUser: UsersUser | null;
  currentAuthUser: AuthUser | null;
  onLogout: () => void;
  loggingOut: boolean;
}

export const createUserMenuItems = ({
  currentUser,
  currentAuthUser,
  onLogout,
  loggingOut,
}: UserMenuItemsProps): MenuProps['items'] => {
  const handleSettings = () => {
    message.info(HEADER_CONSTANTS.USER.SETTINGS.MESSAGE);
  };

  return [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: HEADER_CONSTANTS.USER.USER_INFO.PADDING }}>
          <div
            style={{
              fontWeight: HEADER_CONSTANTS.USER.USER_INFO.USERNAME.FONT_WEIGHT,
              fontSize: HEADER_CONSTANTS.USER.USER_INFO.USERNAME.FONT_SIZE,
              color: HEADER_CONSTANTS.USER.USER_INFO.USERNAME.COLOR,
            }}
          >
            {currentUser?.username || currentAuthUser?.username || 'User'}
          </div>
          {currentUser?.email || currentAuthUser?.email ? (
            <div
              style={{
                fontSize: HEADER_CONSTANTS.USER.USER_INFO.EMAIL.FONT_SIZE,
                color: HEADER_CONSTANTS.USER.USER_INFO.EMAIL.COLOR,
                marginTop: HEADER_CONSTANTS.USER.USER_INFO.EMAIL.MARGIN_TOP,
              }}
            >
              {currentUser?.email || currentAuthUser?.email}
            </div>
          ) : null}
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: HEADER_CONSTANTS.USER.MENU_ITEM.GAP,
          }}
        >
          <SettingOutlined />
          <span>Settings</span>
        </div>
      ),
      onClick: handleSettings,
    },
    {
      key: 'logout',
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: HEADER_CONSTANTS.USER.MENU_ITEM.GAP,
            color: DEFAULT_COLORS.SUCCESS,
          }}
        >
          <LogoutOutlined style={{ color: DEFAULT_COLORS.SUCCESS }} />
          <span style={{ color: DEFAULT_COLORS.SUCCESS }}>Logout</span>
        </div>
      ),
      onClick: onLogout,
      disabled: loggingOut,
    },
  ];
};
