import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form } from 'antd';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { DEFAULT_COLORS, Icons } from '../../../../../../constants';
import { ATTACHED_MEMBERS_CONSTANTS as AMC } from '../../../../groups/constants';
import { CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { Group } from '../../../../groups/models';

const GroupIcon = Icons.Group;

interface UserGroupSelectListProps {
  groups?: Group[];
  loading: boolean;
  allGroups?: Group[];
}

const UserGroupSelectList: React.FC<UserGroupSelectListProps> = ({
  groups,
  loading,
  allGroups,
}) => {
  const form = Form.useFormInstance();
  const watchedSelectedGroups = Form.useWatch('assignedGroupsIDs', form);
  const currentSelectedGroups = useMemo(
    () => (watchedSelectedGroups as string[]) || [],
    [watchedSelectedGroups],
  );

  const handleChange = useCallback(
    (checkedValues: string[]) => {
      if (!allGroups) {
        form.setFieldsValue({ assignedGroupsIDs: checkedValues });
        return;
      }

      const filteredGroupIds = groups?.map((g) => g.id) || [];
      const preservedSelections = currentSelectedGroups.filter(
        (groupId) => !filteredGroupIds.includes(groupId),
      );

      const merged = Array.from(new Set([...preservedSelections, ...checkedValues]));
      form.setFieldsValue({ assignedGroupsIDs: merged });
    },
    [form, allGroups, groups, currentSelectedGroups],
  );

  if (loading) {
    return <div style={AMC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.LOADING_GROUPS}</div>;
  }

  if (!groups || groups.length === 0) {
    return <div style={AMC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.NO_GROUPS_AVAILABLE}</div>;
  }

  const filteredSelectedGroups = currentSelectedGroups.filter((gId) =>
    groups.some((g) => g.id === gId),
  );

  return (
    <Form.Item name="assignedGroupsIDs" style={{ margin: 0, width: '100%' }}>
      <Checkbox.Group
        style={{ width: '100%' }}
        value={filteredSelectedGroups}
        onChange={handleChange}
      >
        <div style={AMC.LIST.CONTAINER}>
          {groups.map((group) => (
            <div
              key={group.id}
              style={AMC.LIST.ITEM.BASE}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, AMC.LIST.ITEM.HOVER);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = AMC.LIST.ITEM.BASE.background;
                e.currentTarget.style.borderColor = AMC.LIST.ITEM.BASE.border;
              }}
            >
              <Checkbox value={group.id} style={{ margin: 0 }}>
                <div style={AMC.LIST.MEMBER_CONTENT}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: DEFAULT_COLORS.TEXT_MUTED,
                    }}
                  >
                    <GroupIcon size={28} />
                  </div>
                  <div style={AMC.LIST.MEMBER_INFO}>
                    <div style={AMC.LIST.MEMBER_NAME}>{CapitalizeFirstLetter(group.name)}</div>
                    {group.description && (
                      <div style={AMC.LIST.MEMBER_EMAIL}>
                        {CapitalizeFirstLetter(group.description)}
                      </div>
                    )}
                  </div>
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default UserGroupSelectList;
