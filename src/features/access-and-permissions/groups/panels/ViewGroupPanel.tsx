import React, { useMemo, useState, useEffect } from 'react';
import { Avatar, Tooltip } from 'antd';
import AnimationWrapper from '../../../../components/display/panels/slide-out/AnimationWrapper';
import { ROLES_CONSTANTS as RPC } from '../../roles/constants';
import { useUsers } from '../../users/hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { getCategoryName } from '../../categories/utils';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import RowTag from '../../../../components/display/table/RowTag';
import { createAvatar } from '@dicebear/core';
import { UserDisplay } from '../../../../components/display/users';
import { Icons } from '../../../../constants';
import type { Group } from '../models';

const GroupIcon = Icons.Group;

interface ViewGroupPanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const ViewGroupPanel: React.FC<ViewGroupPanelProps> = ({ open, onClose, group }) => {
  const { users } = useUsers();
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);
  const [avatarSources, setAvatarSources] = useState<Record<string, string>>({});

  const groupUsers = useMemo(() => {
    if (!group || !users) return [];
    return group.assignedUsersIDs
      .map((userId) => users.find((u) => u.id === userId))
      .filter((user): user is NonNullable<typeof user> => user != null);
  }, [group, users]);

  const categoryName = useMemo(() => {
    if (!group || !categories) return '—';
    return getCategoryName(group.categoryID, categories);
  }, [group, categories]);

  const createdByUser = useMemo(() => {
    if (!group?.createdBy || !users) return null;
    return users.find((u) => u.id === group.createdBy) || null;
  }, [group, users]);

  const lastUpdatedByUser = useMemo(() => {
    if (!group?.lastUpdatedBy || !users) return null;
    return users.find((u) => u.id === group.lastUpdatedBy) || null;
  }, [group, users]);

  // Generate avatar sources for Avatar.Group
  useEffect(() => {
    const generateAvatars = async () => {
      const sources: Record<string, string> = {};
      const getAvatarStyle = async (styleName: string) => {
        const styleMap: Record<string, () => Promise<any>> = {
          avataaars: () => import('@dicebear/avataaars'),
          adventurer: () => import('@dicebear/adventurer'),
          'big-smile': () => import('@dicebear/big-smile'),
          bottts: () => import('@dicebear/bottts'),
          'fun-emoji': () => import('@dicebear/fun-emoji'),
          identicon: () => import('@dicebear/identicon'),
          lorelei: () => import('@dicebear/lorelei'),
          micah: () => import('@dicebear/micah'),
          miniavs: () => import('@dicebear/miniavs'),
          'open-peeps': () => import('@dicebear/open-peeps'),
          personas: () => import('@dicebear/personas'),
          'pixel-art': () => import('@dicebear/pixel-art'),
        };
        const loader = styleMap[styleName];
        return loader ? await loader() : null;
      };

      for (const user of groupUsers) {
        if (user.avatar?.style && user.avatar?.seed) {
          try {
            const styleModule = await getAvatarStyle(user.avatar.style);
            if (styleModule) {
              const generated = createAvatar(styleModule.default || styleModule, {
                seed: user.avatar.seed,
                size: 32 * 2,
              });
              sources[user.id] = generated.toDataUri();
            }
          } catch (error) {
            console.error('Failed to load avatar style:', error);
          }
        }
      }

      // Also generate avatars for createdBy and lastUpdatedBy users
      if (createdByUser?.avatar?.style && createdByUser?.avatar?.seed) {
        try {
          const styleModule = await getAvatarStyle(createdByUser.avatar.style);
          if (styleModule) {
            const generated = createAvatar(styleModule.default || styleModule, {
              seed: createdByUser.avatar.seed,
              size: 16 * 2,
            });
            sources[createdByUser.id] = generated.toDataUri();
          }
        } catch (error) {
          console.error('Failed to load avatar style:', error);
        }
      }

      if (lastUpdatedByUser?.avatar?.style && lastUpdatedByUser?.avatar?.seed) {
        try {
          const styleModule = await getAvatarStyle(lastUpdatedByUser.avatar.style);
          if (styleModule) {
            const generated = createAvatar(styleModule.default || styleModule, {
              seed: lastUpdatedByUser.avatar.seed,
              size: 16 * 2,
            });
            sources[lastUpdatedByUser.id] = generated.toDataUri();
          }
        } catch (error) {
          console.error('Failed to load avatar style:', error);
        }
      }
      setAvatarSources(sources);
    };

    generateAvatars();
  }, [groupUsers, createdByUser, lastUpdatedByUser]);

  if (!group) return null;

  return (
    <AnimationWrapper open={open} onClose={onClose} title="Group Details" width={520}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header Section with Icon, Name, and Users */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            paddingBottom: 20,
            borderBottom: '1px solid #eef2f6',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(32, 201, 151, 0.35)',
            }}
          >
            <GroupIcon size={32} style={{ color: '#20C997' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginTop: -4 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: '#0B1F33',
                letterSpacing: '-0.02em',
                textTransform: 'capitalize',
              }}
            >
              {group.name}
            </h3>
            {group.description && (
              <p
                style={{
                  margin: '0 0 4px 0',
                  fontSize: 13,
                  color: '#64748b',
                  textAlign: 'center',
                  maxWidth: '360px',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}
              >
                {group.description}
              </p>
            )}
            {groupUsers.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                {groupUsers.slice(0, 5).map((user, index) => (
                  <Tooltip key={user.id} title={user.username} placement="top">
                    <Avatar
                      src={avatarSources[user.id]}
                      size={32}
                      style={{
                        border: '1.5px solid #20C997',
                        padding: 1.5,
                        background: '#fff',
                        boxSizing: 'border-box',
                        marginLeft: index === 0 ? 0 : -10,
                        boxShadow: '0 0 0 2px #fff',
                      }}
                    >
                      {!avatarSources[user.id] && user.username
                        ? user.username.charAt(0).toUpperCase()
                        : null}
                    </Avatar>
                  </Tooltip>
                ))}
                {groupUsers.length > 5 && (
                  <Tooltip
                    title={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {groupUsers.slice(5).map((user) => (
                          <div
                            key={user.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <Avatar src={avatarSources[user.id]} size={24} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                              {user.username}
                            </span>
                          </div>
                        ))}
                      </div>
                    }
                    placement="top"
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#20C997',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 12,
                        marginLeft: -6,
                        boxShadow: '0 0 0 3px #fff',
                        zIndex: 1,
                        cursor: 'default',
                      }}
                    >
                      +{groupUsers.length - 5}
                    </div>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Flat rows layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Category
            </span>
            <RowTag text={categoryName} background={RPC.COLORS.TYPE_CUSTOM_BG} color={RPC.COLORS.TYPE_CUSTOM_TEXT} fontSize={12} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Creation Date
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#0B1F33' }}>
              {group.creationDate ? <TimeAgo date={group.creationDate} /> : '—'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Last Update
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#0B1F33' }}>
              {group.lastUpdateDate ? <TimeAgo date={group.lastUpdateDate} /> : '—'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Created By
            </span>
            {createdByUser ? (
              <UserDisplay user={createdByUser} size="small" showBorder />
            ) : (
              <span style={{ color: '#64748b' }}>—</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Last Updated By
            </span>
            {lastUpdatedByUser ? (
              <UserDisplay user={lastUpdatedByUser} size="small" showBorder />
            ) : (
              <span style={{ color: '#64748b' }}>—</span>
            )}
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default ViewGroupPanel;
