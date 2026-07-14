import React, { useState, useMemo } from 'react';
import { Form } from 'antd';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { FilterPanel } from '../../../../../components/display/panels/filter';
import { FilterButton, ToggleButton } from '../../../../../components/display/buttons';
import { SearchInput } from '../../../../../components/display/inputs';
import ActionConfirmModal from '../../../../../components/display/modal/confirm/ActionConfirmModal';
import { Icons } from '../../../../../constants';
import { useAttachRolePanel, useDeassignGroupRole } from '../../hooks';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../features/auth/hooks/permissions/permissionEngine';
import RoleList from '../../components/display/role/RoleList';
import GroupAssignedRolesView from '../../components/display/role/GroupAssignedRolesView';
import type { Group } from '../../models';
import { buildAttachRoleFilterFields } from '../../config/attachRoleFilterConfig';
import { applyRoleFilters } from '../../utils';
import { useRoleCategoryOptions } from '../../hooks/categories/useRoleCategoryOptions';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { filterBySearchTerm } from '../../../users/utils/search/filter';
import { CapitalizeFirstLetter } from '../../../../../utils/helpers/format';
import { CheckCircleOutlined } from '@ant-design/icons';

const RoleIcon = Icons.Role;

type ActiveView = 'select' | 'assigned';

const PANEL_WIDTH = 650;
const PANEL_WIDTH_EXPANDED = 960;
const FILTER_PANEL_WIDTH = 480;

interface AttachRolePanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const AttachRolePanel: React.FC<AttachRolePanelProps> = ({ open, onClose, group }) => {
  const [form] = Form.useForm();
  const watchedRoles = Form.useWatch('assignedRolesIDs', form);
  const currentSelectedRoles = useMemo(() => (watchedRoles as string[]) || [], [watchedRoles]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<ActiveView>('select');
  const [expanded, setExpanded] = useState(false);

  const { categoryOptions } = useRoleCategoryOptions();

  const {
    currentGroup,
    initialSelectedRoles,
    hasChanges,
    filteredRoles: baseFilteredRoles,
    allRoles,
    rolesLoading,
    submitting,
    handleSubmit,
  } = useAttachRolePanel({
    open,
    group,
    form,
    onClose,
    currentSelectedRoles,
  });

  const canRemoveRole = usePermission(
    ACTION_PERMISSIONS.groups.removeRole.scope,
    ACTION_PERMISSIONS.groups.removeRole.level,
    ACTION_PERMISSIONS.groups.removeRole.deny,
  );
  const canAttachRole = usePermission(
    ACTION_PERMISSIONS.groups.attachRole.scope,
    ACTION_PERMISSIONS.groups.attachRole.level,
    ACTION_PERMISSIONS.groups.attachRole.deny,
  );

  const {
    deassignModalOpen,
    deassigningRole,
    isDeassigning,
    openDeassignModal,
    closeDeassignModal,
    handleConfirmDeassign,
  } = useDeassignGroupRole({ group: currentGroup, form });

  const filterFields = useMemo(
    () => buildAttachRoleFilterFields(categoryOptions),
    [categoryOptions],
  );

  const filteredRoles = useMemo(
    () => applyRoleFilters(baseFilteredRoles, appliedFilters, searchTerm),
    [baseFilteredRoles, appliedFilters, searchTerm],
  );

  const assignedRoleIdsForView = useMemo(() => {
    if (currentSelectedRoles.length > 0) return currentSelectedRoles;
    return currentGroup?.assignedRolesIDs ?? [];
  }, [currentSelectedRoles, currentGroup?.assignedRolesIDs]);

  const filteredAssignedRoleIds = useMemo(() => {
    return filterBySearchTerm(assignedRoleIdsForView, searchTerm, (id) => {
      const role = allRoles?.find((r) => r.id === id);
      return [role?.name, role?.description];
    });
  }, [assignedRoleIdsForView, searchTerm, allRoles]);

  const handleFilterChange = (filters: Record<string, unknown>) => {
    setAppliedFilters(filters);
  };

  const handleFilterApply = (filters: Record<string, unknown>) => {
    setAppliedFilters(filters);
    setFilterPanelOpen(false);
  };

  const handleFilterReset = () => {
    setAppliedFilters({});
  };

  const handleToggleAssigned = () => {
    setActiveView((prev) => (prev === 'assigned' ? 'select' : 'assigned'));
    setFilterPanelOpen(false);
  };

  const isReadOnlyView = activeView === 'assigned';

  if (!currentGroup) return null;

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={GC.LABELS.PANELS.ATTACH_ROLES.TITLE}
        subtitle={GC.LABELS.PANELS.ATTACH_ROLES.SUBTITLE(CapitalizeFirstLetter(currentGroup.name))}
        width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
        offsetX={filterPanelOpen ? FILTER_PANEL_WIDTH : 0}
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
                placeholder={GC.LABELS.PANELS.ATTACH_ROLES.SEARCH_PLACEHOLDER}
                minWidth={200}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <ToggleButton
                  active={activeView === 'assigned'}
                  onClick={handleToggleAssigned}
                  label={GC.LABELS.PANELS.ATTACH_ROLES.SHOW_ASSIGNED_BUTTON}
                  icon={<CheckCircleOutlined />}
                  tooltip={GC.LABELS.PANELS.ATTACH_ROLES.SHOW_ASSIGNED_TOOLTIP}
                />
                <FilterButton
                  onClick={() => setFilterPanelOpen(true)}
                  disabled={filterPanelOpen || isReadOnlyView}
                />
              </div>
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
              {activeView === 'assigned' && (
                <GroupAssignedRolesView
                  assignedRoleIds={filteredAssignedRoleIds}
                  allRoles={allRoles}
                  loading={rolesLoading}
                  onDeassignClick={canRemoveRole ? openDeassignModal : undefined}
                />
              )}
              {activeView === 'select' && (
                <RoleList
                  roles={filteredRoles}
                  loading={rolesLoading}
                  allRoles={allRoles}
                  canSelect={canAttachRole}
                />
              )}
            </div>
          </div>
        }
        onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
        onCancel={onClose}
        submitButtonText={GC.LABELS.PANELS.ATTACH_ROLES.SUBMIT_BUTTON}
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
        title={GC.LABELS.ACTIONS.DEASSIGN_ROLE_MODAL_TITLE}
        action={GC.LABELS.ACTIONS.DEASSIGN_ROLE_MODAL_ACTION}
        resourceName={CapitalizeFirstLetter(deassigningRole?.name ?? '')}
        resourceType={GC.LABELS.ACTIONS.DEASSIGN_ROLE_RESOURCE_TYPE}
        confirmText={GC.LABELS.ACTIONS.DEASSIGN_ROLE_MODAL_CONFIRM}
        cancelText={GC.LABELS.MODAL.CANCEL}
        loading={isDeassigning}
        getContainer={() => document.body}
        offsetRight={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      />
    </>
  );
};

export default AttachRolePanel;
