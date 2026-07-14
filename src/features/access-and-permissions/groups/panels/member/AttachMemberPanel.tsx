import React, { useState, useMemo, useCallback } from 'react';
import { Form } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { SearchInput } from '../../../../../components/display/inputs';
import { ToggleButton } from '../../../../../components/display/buttons';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { Icons } from '../../../../../constants';
import { useAttachMemberPanel, useDeassignGroupMember } from '../../hooks';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../features/auth/hooks/permissions/permissionEngine';
import MemberList from '../../components/display/member/MemberList';
import GroupAssignedMembersView from '../../components/display/member/GroupAssignedMembersView';
import type { Group } from '../../models';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { filterBySearchTerm } from '../../../users/utils/search/filter';
import { CapitalizeFirstLetter } from '../../../../../utils/helpers/format';

const UserIcon = Icons.User;

const PANEL_WIDTH = 600;
const PANEL_WIDTH_EXPANDED = 900;

interface AttachMemberPanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const AttachMemberPanel: React.FC<AttachMemberPanelProps> = ({ open, onClose, group }) => {
  const [form] = Form.useForm();
  const currentSelectedUsers = (Form.useWatch('assignedUsersIDs', form) as string[]) || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>(
    () => group?.assignedUsersIDs ?? [],
  );

  const [prevGroup, setPrevGroup] = useState(group);
  if (prevGroup !== group) {
    setPrevGroup(group);
    setLocalAssignedIds(group?.assignedUsersIDs ?? []);
  }

  const {
    currentGroup,
    initialSelectedUsers,
    hasChanges,
    allUsers,
    usersLoading,
    submitting,
    handleSubmit,
  } = useAttachMemberPanel({
    open,
    group,
    form,
    onClose,
    currentSelectedUsers,
  });

  const canRemoveMemberFromGroup = usePermission(
    ACTION_PERMISSIONS.groups.removeMember.scope,
    ACTION_PERMISSIONS.groups.removeMember.level,
    ACTION_PERMISSIONS.groups.removeMember.deny,
  );
  const canRemoveUserFromGroup = usePermission(
    ACTION_PERMISSIONS.users.removeFromGroup.scope,
    ACTION_PERMISSIONS.users.removeFromGroup.level,
    ACTION_PERMISSIONS.users.removeFromGroup.deny,
  );
  const canRemoveMember = canRemoveMemberFromGroup && canRemoveUserFromGroup;

  const handleDeassignSuccess = useCallback((updatedUserIds: string[]) => {
    setLocalAssignedIds(updatedUserIds);
  }, []);

  const {
    deassignModalOpen,
    deassigningUser,
    isDeassigning,
    openDeassignModal,
    closeDeassignModal,
    handleConfirmDeassign,
  } = useDeassignGroupMember({
    group: currentGroup,
    form,
    onSuccess: handleDeassignSuccess,
  });

  const filteredUsers = useMemo(
    () =>
      filterBySearchTerm(allUsers || [], searchTerm, (u) => [u.username, u.email].filter(Boolean)),
    [allUsers, searchTerm],
  );

  const filteredAssignedUserIds = useMemo(
    () =>
      filterBySearchTerm(localAssignedIds, searchTerm, (id) => {
        const user = allUsers?.find((u) => u.id === id);
        return user ? [user.username, user.email].filter(Boolean) : [];
      }),
    [localAssignedIds, searchTerm, allUsers],
  );

  const handleToggleAssignedOnly = useCallback(() => {
    setShowAssignedOnly((prev) => !prev);
  }, []);

  if (!currentGroup) return null;

  const panelWidth = expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH;

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={GC.LABELS.PANELS.ASSIGN_MEMBERS.TITLE}
        subtitle={GC.LABELS.PANELS.ASSIGN_MEMBERS.SUBTITLE(
          CapitalizeFirstLetter(currentGroup.name),
        )}
        width={panelWidth}
        headerExtra={
          <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((prev) => !prev)} />
        }
        formContent={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                width: '100%',
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
              }}
            >
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={GC.LABELS.PANELS.ASSIGN_MEMBERS.SEARCH_PLACEHOLDER}
                minWidth={300}
              />
              <ToggleButton
                active={showAssignedOnly}
                onClick={handleToggleAssignedOnly}
                label={GC.LABELS.PANELS.ASSIGN_MEMBERS.SHOW_ASSIGNED_BUTTON}
                icon={<CheckCircleOutlined />}
                tooltip={GC.LABELS.PANELS.ASSIGN_MEMBERS.SHOW_ASSIGNED_TOOLTIP}
              />
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
              {showAssignedOnly ? (
                <GroupAssignedMembersView
                  assignedUserIds={filteredAssignedUserIds}
                  allUsers={allUsers}
                  loading={usersLoading}
                  onDeassignClick={canRemoveMember ? openDeassignModal : undefined}
                />
              ) : (
                <MemberList
                  users={filteredUsers}
                  loading={usersLoading}
                  allUsers={allUsers}
                  canSelect={canRemoveMember}
                />
              )}
            </div>
          </div>
        }
        onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
        onCancel={onClose}
        submitButtonText={GC.LABELS.PANELS.ASSIGN_MEMBERS.SUBMIT_BUTTON}
        submitButtonIcon={<UserIcon size={16} />}
        loading={submitting}
        disabled={!hasChanges || showAssignedOnly}
        form={form}
        initialValues={{ assignedUsersIDs: initialSelectedUsers }}
      />
      <ActionConfirmModal
        open={deassignModalOpen}
        onClose={closeDeassignModal}
        onConfirm={handleConfirmDeassign}
        title={GC.LABELS.ACTIONS.DEASSIGN_MEMBER_MODAL_TITLE}
        action={GC.LABELS.ACTIONS.DEASSIGN_MEMBER_MODAL_ACTION}
        resourceName={CapitalizeFirstLetter(deassigningUser?.username ?? '')}
        resourceType={GC.LABELS.ACTIONS.DEASSIGN_MEMBER_RESOURCE_TYPE}
        confirmText={GC.LABELS.ACTIONS.DEASSIGN_MEMBER_MODAL_CONFIRM}
        loading={isDeassigning}
        getContainer={() => document.body}
        offsetRight={panelWidth}
      />
    </>
  );
};

export default AttachMemberPanel;
