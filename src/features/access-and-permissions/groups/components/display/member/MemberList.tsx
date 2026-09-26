import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form, Tooltip } from 'antd';
import {
  GROUPS_CONSTANTS as GC,
  ATTACHED_MEMBERS_CONSTANTS as AMC,
  ATTACHED_ROLES_CONSTANTS as ARC,
} from '../../../constants';
import UserAvatar from '../../../../../../components/display/avatars/UserAvatar';
import type { User } from '../../../../users/models';

interface MemberListProps {
  users: User[] | undefined;
  loading: boolean;
  allUsers?: User[] | undefined;
  blockedReason?: (userId: string) => string | undefined;
  fieldName?: string;
}

const MemberList: React.FC<MemberListProps> = ({
  users,
  loading,
  allUsers,
  blockedReason,
  fieldName = 'userRefs',
}) => {
  const form = Form.useFormInstance();
  const watchedSelectedUsers = Form.useWatch(fieldName, form);
  const currentSelectedUsers = useMemo(
    () => (watchedSelectedUsers as string[]) || [],
    [watchedSelectedUsers],
  );

  const handleChange = useCallback(
    (checkedValues: string[]) => {
      if (!allUsers) {
        form.setFieldsValue({ [fieldName]: checkedValues });
        return;
      }

      const filteredUserIds = users?.map((user) => user.id) || [];
      const preservedSelections = (currentSelectedUsers as string[]).filter(
        (userId) => !filteredUserIds.includes(userId),
      );

      const mergedSelections = [...preservedSelections, ...checkedValues];
      const uniqueSelections = Array.from(new Set(mergedSelections));
      form.setFieldsValue({ [fieldName]: uniqueSelections });
    },
    [form, allUsers, users, currentSelectedUsers, fieldName],
  );

  if (loading) {
    return <div style={AMC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.LOADING_MEMBERS}</div>;
  }

  if (!users || users.length === 0) {
    return <div style={AMC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.NO_MEMBERS_AVAILABLE}</div>;
  }

  const filteredSelectedUsers = (currentSelectedUsers as string[]).filter((userId) =>
    users.some((user) => user.id === userId),
  );

  return (
    <div style={{ width: '100%' }}>
      <Form.Item name={fieldName} style={{ margin: 0, width: '100%' }}>
        <Checkbox.Group
          style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          value={filteredSelectedUsers}
          onChange={handleChange}
        >
          <div className="role-list-container" style={AMC.LIST.CONTAINER}>
            {users.map((user) => {
              const blockedTooltip = blockedReason?.(user.id);
              return (
                <Tooltip key={user.id} title={blockedTooltip} placement="left">
                  <div
                    style={{
                      ...AMC.LIST.ITEM.BASE,
                      ...(blockedTooltip ? ARC.LIST.ITEM.DISABLED : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (!blockedTooltip)
                        Object.assign(e.currentTarget.style, AMC.LIST.ITEM.HOVER);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = AMC.LIST.ITEM.BASE.background;
                      e.currentTarget.style.borderColor = AMC.LIST.ITEM.BASE.border;
                    }}
                  >
                    <Checkbox
                      value={user.id}
                      style={{ margin: 0, width: '100%' }}
                      disabled={Boolean(blockedTooltip)}
                    >
                      <div style={AMC.LIST.MEMBER_CONTENT}>
                        <div style={AMC.LIST.MEMBER_AVATAR_CONTAINER}>
                          <UserAvatar avatar={user.avatar} username={user.username} size={32} />
                        </div>
                        <div style={AMC.LIST.MEMBER_INFO}>
                          <div style={AMC.LIST.MEMBER_NAME}>{user.username}</div>
                          {user.email && <div style={AMC.LIST.MEMBER_EMAIL}>{user.email}</div>}
                        </div>
                      </div>
                    </Checkbox>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </Checkbox.Group>
      </Form.Item>
    </div>
  );
};

export default MemberList;
