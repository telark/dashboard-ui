import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form, Tooltip } from 'antd';
import { ScrollIndicator } from '../../../../../../../components/display/indicators';
import { SelectableListItem } from '../../../../../../../components/display/list';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import {
  ATTACHED_MEMBERS_CONSTANTS as AMC,
  ATTACHED_ROLES_CONSTANTS as ARC,
} from '../../../../../groups/constants';
import { useRoleListScroll } from '../../../../../groups/hooks/scroll/useRoleListScroll';
import { CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import type { Group } from '../../../../../groups/models';

interface UserGroupSelectListProps {
  groups?: Group[];
  loading: boolean;
  allGroups?: Group[];
  blockedReason?: (groupId: string) => string | undefined;
}

const UserGroupSelectList: React.FC<UserGroupSelectListProps> = ({
  groups,
  loading,
  allGroups,
  blockedReason,
}) => {
  const form = Form.useFormInstance();
  const watchedSelectedGroups = Form.useWatch('groupRefs', form);
  const currentSelectedGroups = useMemo(
    () => (watchedSelectedGroups as string[]) || [],
    [watchedSelectedGroups],
  );

  const {
    scrollContainerRef,
    setShowScrollIndicator,
    isScrollable,
    containerClassName,
    containerStyle,
    wrapperStyle,
  } = useRoleListScroll({ itemsCount: groups?.length });

  const handleChange = useCallback(
    (checkedValues: string[]) => {
      if (!allGroups) {
        form.setFieldsValue({ groupRefs: checkedValues });
        return;
      }

      const filteredGroupIds = groups?.map((g) => g.id) || [];
      const preservedSelections = currentSelectedGroups.filter(
        (groupId) => !filteredGroupIds.includes(groupId),
      );

      form.setFieldsValue({
        groupRefs: Array.from(new Set([...preservedSelections, ...checkedValues])),
      });
    },
    [form, allGroups, groups, currentSelectedGroups],
  );

  if (loading) {
    return <div style={AMC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.LOADING_GROUPS}</div>;
  }

  if (!groups || groups.length === 0) {
    return <div style={AMC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.NO_GROUPS_AVAILABLE}</div>;
  }

  const visibleSelectedGroups = currentSelectedGroups.filter((gId) =>
    groups.some((g) => g.id === gId),
  );

  return (
    <Form.Item name="groupRefs" style={{ margin: 0, width: '100%' }}>
      <Checkbox.Group
        value={visibleSelectedGroups}
        onChange={handleChange}
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div style={wrapperStyle}>
          <div
            ref={scrollContainerRef}
            className={containerClassName}
            style={{ ...AMC.LIST.CONTAINER, ...containerStyle }}
          >
            {groups.map((group) => {
              const blockedTooltip = blockedReason?.(group.id);
              const listItem = (
                <SelectableListItem
                  value={group.id}
                  disabled={Boolean(blockedTooltip)}
                  name={CapitalizeFirstLetter(group.name)}
                  description={
                    group.description ? CapitalizeFirstLetter(group.description) : undefined
                  }
                  itemStyles={{
                    base: {
                      ...AMC.LIST.ITEM.BASE,
                      ...(blockedTooltip ? ARC.LIST.ITEM.DISABLED : {}),
                    },
                    hover: blockedTooltip ? ARC.LIST.ITEM.DISABLED : AMC.LIST.ITEM.HOVER,
                  }}
                  nameStyles={AMC.LIST.MEMBER_NAME}
                  descriptionStyles={AMC.LIST.MEMBER_EMAIL}
                />
              );
              return blockedTooltip ? (
                <Tooltip key={group.id} title={blockedTooltip} placement="left">
                  <div>{listItem}</div>
                </Tooltip>
              ) : (
                <React.Fragment key={group.id}>{listItem}</React.Fragment>
              );
            })}
          </div>
          <ScrollIndicator
            containerRef={scrollContainerRef}
            isScrollable={isScrollable}
            onVisibilityChange={setShowScrollIndicator}
          />
        </div>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default UserGroupSelectList;
