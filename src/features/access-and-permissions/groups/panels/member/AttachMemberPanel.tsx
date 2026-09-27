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
import { Icons, SLIDE_OUT } from '../../../../../constants';
import { useAttachMemberPanel, useDeassignGroupMember } from '../../hooks';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../features/auth/hooks/permissions/permissionEngine';
import MemberList from '../../components/display/member/MemberList';
import GroupAssignedMembersView from '../../components/display/member/GroupAssignedMembersView';
import type { Group } from '../../models';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { USERS_CONSTANTS as UC } from '../../../users/constants';
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
  const currentSelectedUsers = (Form.useWatch('userRefs', form) as string[]) || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>(() => group?.userRefs ?? []);

  const [prevGroup, setPrevGroup] = useState(group);
  if (prevGroup !== group) {
    setPrevGroup(group);
    setLocalAssignedIds(group?.userRefs ?? []);
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

  const canAddMember = usePermission(
    ACTION_PERMISSIONS.groups.attachMember.scope,
    ACTION_PERMISSIONS.groups.attachMember.level,
    ACTION_PERMISSIONS.groups.attachMember.deny,
  );
  const canRemoveMember = usePermission(
    ACTION_PERMISSIONS.groups.removeMember.scope,
    ACTION_PERMISSIONS.groups.removeMember.level,
    ACTION_PERMISSIONS.groups.removeMember.deny,
  );

  // Unchecking a member is a removal, checking another user is an add: each has its own rule.
  // Chart-managed (bootstrap) members can't be removed here at all.
  const removeBlockedFor = useCallback(
    (userId: string) => {
      if (allUsers?.find((u) => u.id === userId)?.bootstrap) {
        return UC.LABELS.ACTIONS.BOOTSTRAP_LOCKED_TOOLTIP;
      }
      return canRemoveMember ? undefined : GC.LABELS.ACTIONS.REMOVE_MEMBER_DISABLED_TOOLTIP;
    },
    [allUsers, canRemoveMember],
  );
  const blockedReason = useCallback(
    (userId: string) => {
      if (initialSelectedUsers.includes(userId)) return removeBlockedFor(userId);
      return canAddMember ? undefined : GC.LABELS.ACTIONS.ADD_MEMBER_DISABLED_TOOLTIP;
    },
    [initialSelectedUsers, removeBlockedFor, canAddMember],
  );

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
        title={SLIDE_OUT.ENTITY_TITLE(
          GC.LABELS.PANELS.ASSIGN_MEMBERS.TITLE,
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
                  onDeassignClick={openDeassignModal}
                  deassignDisabledReason={(user) => removeBlockedFor(user.id)}
                />
              ) : (
                <MemberList
                  users={filteredUsers}
                  loading={usersLoading}
                  allUsers={allUsers}
                  blockedReason={blockedReason}
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
        initialValues={{ userRefs: initialSelectedUsers }}
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
