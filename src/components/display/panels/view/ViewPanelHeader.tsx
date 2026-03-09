import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { VIEW } from '../../../../constants/layout/panels';
import type { ViewPanelHeaderProps } from './types';

const DEFAULT_MAX_VISIBLE_AVATARS = 5;
const ViewPanelHeader: React.FC<ViewPanelHeaderProps> = ({
  icon,
  name,
  description,
  avatars = [],
  overflowItems = [],
  maxVisibleAvatars = DEFAULT_MAX_VISIBLE_AVATARS,
}) => {
  const hasOverflow = avatars.length > maxVisibleAvatars;
  const visibleAvatars = avatars.slice(0, maxVisibleAvatars);
  const overflowCount = avatars.length - maxVisibleAvatars;

  return (
    <div style={VIEW.HEADER}>
      {icon != null && <div style={VIEW.ICON_WRAPPER}>{icon}</div>}
      <div style={VIEW.NAME_STACK}>
        <h3 style={VIEW.TITLE}>{name}</h3>
        {description && <p style={VIEW.DESCRIPTION}>{description}</p>}
        {avatars.length > 0 && (
          <div style={VIEW.AVATAR_ROW}>
            {visibleAvatars.map((avatar, index) => (
              <Tooltip key={avatar.key} title={avatar.tooltip} placement="top">
                <Avatar
                  src={avatar.src}
                  size={32}
                  style={{
                    ...VIEW.AVATAR,
                    marginLeft: index === 0 ? 0 : -10,
                  }}
                >
                  {!avatar.src && avatar.fallback ? avatar.fallback : null}
                </Avatar>
              </Tooltip>
            ))}
            {hasOverflow && (
              <Tooltip
                title={
                  <div style={VIEW.OVERFLOW_TOOLTIP}>
                    {overflowItems.map((user) => (
                      <div key={user.key} style={VIEW.OVERFLOW_TOOLTIP_ITEM}>
                        <Avatar src={user.src} size={24} />
                        <span style={VIEW.OVERFLOW_USERNAME}>{user.username}</span>
                      </div>
                    ))}
                  </div>
                }
                placement="top"
              >
                <div style={VIEW.OVERFLOW_BADGE}>+{overflowCount}</div>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPanelHeader;
