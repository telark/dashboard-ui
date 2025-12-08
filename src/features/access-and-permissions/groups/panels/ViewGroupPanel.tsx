import React, { useMemo } from 'react';
import AnimationWrapper from '../../../../components/display/panels/slide-out/AnimationWrapper';
import { Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RPC } from '../../roles/constants';
import { useUsers } from '../../users/hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { getCategoryName } from '../../categories/utils';
import { UserDisplay } from '../../../../components/display/users';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import RowTag from '../../../../components/display/table/RowTag';
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
  }, [group?.createdBy, users]);

  const lastUpdatedByUser = useMemo(() => {
    if (!group?.lastUpdatedBy || !users) return null;
    return users.find((u) => u.id === group.lastUpdatedBy) || null;
  }, [group?.lastUpdatedBy, users]);

  if (!group) return null;

  return (
    <AnimationWrapper open={open} onClose={onClose} title="Group Details" width={800}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Header Section with Icon and Name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            paddingBottom: 24,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #e0e0e0',
            }}
          >
            <GroupIcon size={40} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0B1F33' }}>
              {group.name}
            </h3>
            {group.description && (
              <p style={{ margin: 0, fontSize: 14, color: '#64748b', textAlign: 'center' }}>
                {group.description}
              </p>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          {/* Group Details Card */}
          <div
            style={{
              background: '#f8f9fa',
              borderRadius: 8,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0B1F33' }}>
              Group Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>Name:</span>
                <span style={{ fontWeight: 500, color: '#0B1F33', fontSize: 14 }}>{group.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>Description:</span>
                <span style={{ fontWeight: 500, color: '#0B1F33', fontSize: 14 }}>
                  {group.description || '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>Category:</span>
                <RowTag
                  text={categoryName}
                  background={RPC.COLORS.TYPE_CUSTOM_BG}
                  color={RPC.COLORS.TYPE_CUSTOM_TEXT}
                  fontSize={12}
                />
              </div>
            </div>
          </div>

          {/* Members Card */}
          <div
            style={{
              background: '#f8f9fa',
              borderRadius: 8,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0B1F33' }}>
              Members ({groupUsers.length})
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxHeight: 200,
                overflowY: 'auto',
              }}
            >
              {groupUsers.length > 0 ? (
                groupUsers.map((user) => (
                  <UserDisplay key={user.id} user={user} size="medium" showBorder={true} />
                ))
              ) : (
                <span style={{ color: '#64748b', fontSize: 14 }}>No members assigned</span>
              )}
            </div>
          </div>

          {/* Metadata Card */}
          <div
            style={{
              background: '#f8f9fa',
              borderRadius: 8,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0B1F33' }}>
              Metadata
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>Creation Date:</span>
                <span style={{ fontWeight: 500, color: '#0B1F33', fontSize: 14 }}>
                  {group.creationDate ? <TimeAgo date={group.creationDate} /> : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>Last Update:</span>
                <span style={{ fontWeight: 500, color: '#0B1F33', fontSize: 14 }}>
                  {group.lastUpdateDate ? <TimeAgo date={group.lastUpdateDate} /> : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>Created By:</span>
                <UserDisplay user={createdByUser} size="small" showBorder={false} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>Last Updated By:</span>
                <UserDisplay user={lastUpdatedByUser} size="small" showBorder={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default ViewGroupPanel;
