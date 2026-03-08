import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Form } from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../../components/display/panels/slide-out';
import { SearchInput } from '../../../../../../components/display/inputs';
import { ToggleButton } from '../../../../../../components/display/buttons';
import { ActionConfirmModal } from '../../../../../../components/display/modal';
import { Icons, DEFAULT_COLORS } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { useManageUserGroupPanel } from '../../../hooks/panels/group/useManageUserGroupPanel';
import { useDeassignUserGroup } from '../../../hooks/panels/group/useDeassignUserGroup';
import UserGroupSelectList from '../../../components/display/manage/group/UserGroupSelectList';
import UserAssignedGroupsView from '../../../components/display/manage/group/UserAssignedGroupsView';
import { CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import { filterBySearchTerm } from '../../../utils/search/filter';
import type { User } from '../../../models';

const GroupIcon = Icons.Group;

interface ManageUserGroupPanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const PANEL_WIDTH = 600;
const PANEL_WIDTH_EXPANDED = 900;

const ManageUserGroupPanel: React.FC<ManageUserGroupPanelProps> = ({ open, onClose, user }) => {
  const [form] = Form.useForm();
  const currentSelectedGroups = (Form.useWatch('assignedGroupsIDs', form) as string[]) || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>(
    () => user?.assignedGroupsIDs ?? [],
  );

  useEffect(() => {
    setLocalAssignedIds(user?.assignedGroupsIDs ?? []);
  }, [user]);

  const { initialSelectedGroups, hasChanges, groups, groupsLoading, submitting, handleSubmit } =
    useManageUserGroupPanel({ open, user, form, onClose, currentSelectedGroups });

  const handleDeassignSuccess = useCallback((updatedGroups: string[]) => {
    setLocalAssignedIds(updatedGroups);
  }, []);

  const {
    deassignModalOpen,
    deassigningGroup,
    isDeassigning,
    openDeassignModal,
    closeDeassignModal,
    handleConfirmDeassign,
  } = useDeassignUserGroup({ user, form, onSuccess: handleDeassignSuccess });

  const filteredGroups = useMemo(
    () => filterBySearchTerm(groups || [], searchTerm, (g) => [g.name, g.description]),
    [groups, searchTerm],
  );

  const filteredAssignedGroupIds = useMemo(
    () =>
      filterBySearchTerm(localAssignedIds, searchTerm, (id) => {
        const group = groups?.find((g) => g.id === id);
        return [group?.name, group?.description];
      }),
    [localAssignedIds, searchTerm, groups],
  );

  const handleToggleAssignedOnly = () => {
    setShowAssignedOnly((prev) => !prev);
  };

  if (!user) return null;

  const panelWidth = expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH;

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={UC.LABELS.PANELS.MANAGE_GROUP.TITLE}
        subtitle={UC.LABELS.PANELS.MANAGE_GROUP.SUBTITLE(
          CapitalizeFirstLetter(user.fullname || user.username),
        )}
        width={panelWidth}
        headerExtra={
          <ExpandPanelButton
            expanded={expanded}
            onToggle={() => setExpanded((prev) => !prev)}
          />
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
                placeholder={UC.LABELS.PANELS.MANAGE_GROUP.SEARCH_PLACEHOLDER}
                minWidth={300}
              />
              <ToggleButton
                active={showAssignedOnly}
                onClick={handleToggleAssignedOnly}
                label={UC.LABELS.PANELS.MANAGE_GROUP.SHOW_ASSIGNED_BUTTON}
                icon={<CheckCircleOutlined />}
              />
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
              {showAssignedOnly ? (
                <UserAssignedGroupsView
                  assignedGroupIds={filteredAssignedGroupIds}
                  allGroups={groups}
                  loading={groupsLoading}
                  onDeassignClick={openDeassignModal}
                />
              ) : (
                <UserGroupSelectList
                  groups={filteredGroups}
                  loading={groupsLoading}
                  allGroups={groups}
                />
              )}
            </div>
          </div>
        }
        onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
        onCancel={onClose}
        submitButtonText={UC.LABELS.PANELS.MANAGE_GROUP.SUBMIT_BUTTON}
        submitButtonIcon={<GroupIcon size={16} />}
        loading={submitting}
        disabled={!hasChanges || showAssignedOnly}
        form={form}
        initialValues={{ assignedGroupsIDs: initialSelectedGroups }}
      />
      <ActionConfirmModal
        open={deassignModalOpen}
        onClose={closeDeassignModal}
        onConfirm={handleConfirmDeassign}
        title={UC.LABELS.ACTIONS.DEASSIGN_GROUP_MODAL_TITLE}
        action={UC.LABELS.ACTIONS.DEASSIGN_GROUP_MODAL_ACTION}
        resourceName={CapitalizeFirstLetter(deassigningGroup?.name ?? '')}
        resourceType={UC.LABELS.ACTIONS.DEASSIGN_GROUP_RESOURCE_TYPE}
        confirmText={UC.LABELS.ACTIONS.DEASSIGN_GROUP_MODAL_CONFIRM}
        loading={isDeassigning}
        icon={<MinusCircleOutlined style={{ fontSize: 28, color: DEFAULT_COLORS.ERROR }} />}
        getContainer={() => document.body}
        offsetRight={panelWidth}
      />
    </>
  );
};

export default ManageUserGroupPanel;
