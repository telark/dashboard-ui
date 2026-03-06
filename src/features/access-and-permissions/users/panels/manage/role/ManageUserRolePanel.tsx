import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Form } from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { SlideOutPanel } from '../../../../../../components/display/panels/slide-out';
import { FilterPanel } from '../../../../../../components/display/panels/filter';
import { FilterButton, ToggleButton } from '../../../../../../components/display/buttons';
import { SearchInput } from '../../../../../../components/display/inputs';
import { ActionConfirmModal } from '../../../../../../components/display/modal';
import { Icons, DEFAULT_COLORS } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { useManageUserRolePanel } from '../../../hooks/panels/role/useManageUserRolePanel';
import { useDeassignUserRole } from '../../../hooks/panels/role/useDeassignUserRole';
import { useGroupInheritedRoles } from '../../../hooks/panels/role/useGroupInheritedRoles';
import { useFetchGroups } from '../../../../groups/hooks/data/useFetchGroups';
import UserRoleSelectList from '../../../components/display/manage/role/UserRoleSelectList';
import UserAssignedRolesView from '../../../components/display/manage/role/UserAssignedRolesView';
import UserGroupInheritedRolesView from '../../../components/display/manage/role/UserGroupInheritedRolesView';
import { buildAttachRoleFilterFields } from '../../../../groups/config/attachRoleFilterConfig';
import { applyRoleFilters } from '../../../../groups/utils';
import { useRoleCategoryOptions } from '../../../../groups/hooks/categories/useRoleCategoryOptions';
import { CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import { filterBySearchTerm } from '../../../utils/search/filter';
import type { User } from '../../../models';

const RoleIcon = Icons.Role;

type ActiveView = 'select' | 'assigned' | 'groupRoles';

interface ManageUserRolePanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const PANEL_WIDTH = 650;
const FILTER_PANEL_WIDTH = 480;

const ManageUserRolePanel: React.FC<ManageUserRolePanelProps> = ({ open, onClose, user }) => {
  const [form] = Form.useForm();
  const currentSelectedRoles = (Form.useWatch('assignedRolesIDs', form) as string[]) || [];
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<ActiveView>('select');
  // Local source of truth for assigned IDs — no timing dependency on roles loading
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>(
    () => user?.assignedRolesIDs ?? [],
  );

  useEffect(() => {
    setLocalAssignedIds(user?.assignedRolesIDs ?? []);
  }, [user]);

  const { categoryOptions } = useRoleCategoryOptions();
  const { groups, loading: groupsLoading } = useFetchGroups();

  const {
    initialSelectedRoles,
    hasChanges,
    filteredRoles: baseFilteredRoles,
    allRoles,
    rolesLoading,
    submitting,
    handleSubmit,
  } = useManageUserRolePanel({ open, user, form, onClose, currentSelectedRoles });

  const handleDeassignSuccess = useCallback((updatedRoles: string[]) => {
    setLocalAssignedIds(updatedRoles);
  }, []);

  const {
    deassignModalOpen,
    deassigningRole,
    isDeassigning,
    openDeassignModal,
    closeDeassignModal,
    handleConfirmDeassign,
  } = useDeassignUserRole({ user, form, onSuccess: handleDeassignSuccess });

  const groupInheritedRoles = useGroupInheritedRoles(user, allRoles, groups);

  const filterFields = useMemo(
    () => buildAttachRoleFilterFields(categoryOptions),
    [categoryOptions],
  );

  const filteredRoles = useMemo(
    () => applyRoleFilters(baseFilteredRoles, appliedFilters, searchTerm),
    [baseFilteredRoles, appliedFilters, searchTerm],
  );

  const inheritedGroupsByRoleId = useMemo(
    () =>
      new Map(
        groupInheritedRoles.map(({ role, fromGroups }) => [
          role.id,
          fromGroups.map((g) => CapitalizeFirstLetter(g.name)),
        ]),
      ),
    [groupInheritedRoles],
  );

  // Both derived from inheritedGroupsByRoleId — no redundant iteration over groupInheritedRoles
  const inheritedRoleIds = useMemo(
    () => new Set(inheritedGroupsByRoleId.keys()),
    [inheritedGroupsByRoleId],
  );

  const inheritedRoleTooltips = useMemo(
    () =>
      new Map(
        Array.from(inheritedGroupsByRoleId.entries()).map(([roleId, groupNames]) => [
          roleId,
          UC.LABELS.MESSAGES.ROLE_INHERITED_FROM_GROUP(groupNames.join(', ')),
        ]),
      ),
    [inheritedGroupsByRoleId],
  );

  const filteredAssignedRoleIds = useMemo(() => {
    const allAssignedIds = [...new Set([...localAssignedIds, ...inheritedRoleIds])];
    return filterBySearchTerm(allAssignedIds, searchTerm, (id) => {
      const role = allRoles?.find((r) => r.id === id);
      return [role?.name, role?.description];
    });
  }, [localAssignedIds, inheritedRoleIds, searchTerm, allRoles]);

  const filteredGroupInheritedRoles = useMemo(
    () =>
      filterBySearchTerm(groupInheritedRoles, searchTerm, ({ role }) => [
        role.name,
        role.description,
      ]),
    [groupInheritedRoles, searchTerm],
  );

  const handleFilterChange = (filters: Record<string, unknown>) => setAppliedFilters(filters);

  const handleFilterApply = (filters: Record<string, unknown>) => {
    setAppliedFilters(filters);
    setFilterPanelOpen(false);
  };

  const handleFilterReset = () => setAppliedFilters({});

  const handleToggleAssigned = () => {
    setActiveView((prev) => (prev === 'assigned' ? 'select' : 'assigned'));
    setFilterPanelOpen(false);
  };

  const handleToggleGroupRoles = () => {
    setActiveView((prev) => (prev === 'groupRoles' ? 'select' : 'groupRoles'));
    setFilterPanelOpen(false);
  };

  const isReadOnlyView = activeView !== 'select';

  if (!user) return null;

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={UC.LABELS.PANELS.MANAGE_ROLE.TITLE}
        subtitle={UC.LABELS.PANELS.MANAGE_ROLE.SUBTITLE(
          CapitalizeFirstLetter(user.fullname || user.username),
        )}
        width={PANEL_WIDTH}
        offsetX={filterPanelOpen ? FILTER_PANEL_WIDTH : 0}
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
                placeholder={UC.LABELS.PANELS.MANAGE_ROLE.SEARCH_PLACEHOLDER}
                minWidth={200}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <ToggleButton
                  active={activeView === 'assigned'}
                  onClick={handleToggleAssigned}
                  label={UC.LABELS.PANELS.MANAGE_ROLE.SHOW_ASSIGNED_BUTTON}
                  icon={<CheckCircleOutlined />}
                />
                <ToggleButton
                  active={activeView === 'groupRoles'}
                  onClick={handleToggleGroupRoles}
                  label={UC.LABELS.PANELS.MANAGE_ROLE.FROM_GROUPS_BUTTON}
                  icon={<TeamOutlined />}
                />
                <FilterButton
                  onClick={() => setFilterPanelOpen(true)}
                  disabled={filterPanelOpen || isReadOnlyView}
                />
              </div>
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
              {activeView === 'assigned' && (
                <UserAssignedRolesView
                  assignedRoleIds={filteredAssignedRoleIds}
                  allRoles={allRoles}
                  loading={rolesLoading}
                  onDeassignClick={openDeassignModal}
                  inheritedRoleIds={inheritedRoleIds}
                  inheritedGroupsByRoleId={inheritedGroupsByRoleId}
                />
              )}
              {activeView === 'groupRoles' && (
                <UserGroupInheritedRolesView
                  items={filteredGroupInheritedRoles}
                  loading={rolesLoading || groupsLoading}
                />
              )}
              {activeView === 'select' && (
                <UserRoleSelectList
                  roles={filteredRoles}
                  loading={rolesLoading}
                  allRoles={allRoles}
                  inheritedRoleTooltips={inheritedRoleTooltips}
                />
              )}
            </div>
          </div>
        }
        onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
        onCancel={onClose}
        submitButtonText={UC.LABELS.PANELS.MANAGE_ROLE.SUBMIT_BUTTON}
        submitButtonIcon={<RoleIcon size={16} />}
        loading={submitting}
        disabled={!hasChanges || isReadOnlyView}
        form={form}
        initialValues={{ assignedRolesIDs: initialSelectedRoles }}
      />
      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        width={FILTER_PANEL_WIDTH}
        fields={filterFields}
        onFilterChange={handleFilterChange}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />
      <ActionConfirmModal
        open={deassignModalOpen}
        onClose={closeDeassignModal}
        onConfirm={handleConfirmDeassign}
        title={UC.LABELS.ACTIONS.DEASSIGN_ROLE_MODAL_TITLE}
        action={UC.LABELS.ACTIONS.DEASSIGN_ROLE_MODAL_ACTION}
        resourceName={CapitalizeFirstLetter(deassigningRole?.name ?? '')}
        resourceType={UC.LABELS.ACTIONS.DEASSIGN_ROLE_RESOURCE_TYPE}
        confirmText={UC.LABELS.ACTIONS.DEASSIGN_ROLE_MODAL_CONFIRM}
        loading={isDeassigning}
        icon={<MinusCircleOutlined style={{ fontSize: 28, color: DEFAULT_COLORS.ERROR }} />}
        getContainer={() => document.body}
        offsetRight={PANEL_WIDTH}
      />
    </>
  );
};

export default ManageUserRolePanel;
