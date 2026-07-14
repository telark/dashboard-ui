import type { MenuProps } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { HEADER_CONSTANTS } from '../../../../../constants';
import type { User } from '../../models';

interface UserMenuItemsProps {
  currentUser: User | null;
  onLogout: () => void;
  onSettings?: () => void;
  loggingOut: boolean;
}

export const createUserMenuItems = ({
  currentUser,
  onLogout,
  onSettings,
  loggingOut,
}: UserMenuItemsProps): MenuProps['items'] => {
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
            {currentUser?.username || 'User'}
          </div>
          {currentUser?.email ? (
            <div
              style={{
                fontSize: HEADER_CONSTANTS.USER.USER_INFO.EMAIL.FONT_SIZE,
                color: HEADER_CONSTANTS.USER.USER_INFO.EMAIL.COLOR,
                marginTop: HEADER_CONSTANTS.USER.USER_INFO.EMAIL.MARGIN_TOP,
              }}
            >
              {currentUser?.email}
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
      onClick: () => onSettings?.(),
    },
    {
      key: 'logout',
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: HEADER_CONSTANTS.USER.MENU_ITEM.GAP,
          }}
        >
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      ),
      onClick: onLogout,
      disabled: loggingOut,
    },
  ];
};
