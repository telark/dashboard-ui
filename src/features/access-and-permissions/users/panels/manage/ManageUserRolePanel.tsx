import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Form } from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { FilterPanel } from '../../../../../components/display/panels/filter';
import { FilterButton, ToggleButton } from '../../../../../components/display/buttons';
import { SearchInput } from '../../../../../components/display/inputs';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { Icons, DEFAULT_COLORS } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import { useManageUserRolePanel } from '../../hooks/panels/useManageUserRolePanel';
import { useDeassignUserRole } from '../../hooks/panels/useDeassignUserRole';
import UserRoleSelectList from '../../components/display/manage/UserRoleSelectList';
import UserAssignedRolesView from '../../components/display/manage/UserAssignedRolesView';
import { buildAttachRoleFilterFields } from '../../../groups/config/attachRoleFilterConfig';
import { applyRoleFilters } from '../../../groups/utils';
import { useRoleCategoryOptions } from '../../../groups/hooks/categories/useRoleCategoryOptions';
import { CapitalizeFirstLetter } from '../../../../../utils/helpers/format';
import type { User } from '../../models';

const RoleIcon = Icons.Role;

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
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);
  // Local source of truth for assigned IDs — no timing dependency on roles loading
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>(
    () => user?.assignedRolesIDs ?? [],
  );

  useEffect(() => {
    setLocalAssignedIds(user?.assignedRolesIDs ?? []);
  }, [user]);

  const { categoryOptions } = useRoleCategoryOptions();

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

  const filterFields = useMemo(
    () => buildAttachRoleFilterFields(categoryOptions),
    [categoryOptions],
  );

  const filteredRoles = useMemo(
    () => applyRoleFilters(baseFilteredRoles, appliedFilters, searchTerm),
    [baseFilteredRoles, appliedFilters, searchTerm],
  );

  const filteredAssignedRoleIds = useMemo(() => {
    if (!searchTerm) return localAssignedIds;
    const lowerSearch = searchTerm.toLowerCase();
    return localAssignedIds.filter((id) => {
      const role = allRoles?.find((r) => r.id === id);
      return (
        role?.name.toLowerCase().includes(lowerSearch) ||
        role?.description?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [localAssignedIds, searchTerm, allRoles]);

  const handleFilterChange = (filters: Record<string, unknown>) => setAppliedFilters(filters);

  const handleFilterApply = (filters: Record<string, unknown>) => {
    setAppliedFilters(filters);
    setFilterPanelOpen(false);
  };

  const handleFilterReset = () => setAppliedFilters({});

  const handleToggleAssignedOnly = () => {
    setShowAssignedOnly((prev) => !prev);
    if (!showAssignedOnly) {
      setFilterPanelOpen(false);
    }
  };

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
                minWidth={300}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ToggleButton
                  active={showAssignedOnly}
                  onClick={handleToggleAssignedOnly}
                  label={UC.LABELS.PANELS.MANAGE_ROLE.SHOW_ASSIGNED_BUTTON}
                  icon={<CheckCircleOutlined />}
                />
                <FilterButton
                  onClick={() => setFilterPanelOpen(true)}
                  disabled={filterPanelOpen || showAssignedOnly}
                />
              </div>
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
              {showAssignedOnly ? (
                <UserAssignedRolesView
                  assignedRoleIds={filteredAssignedRoleIds}
                  allRoles={allRoles}
                  loading={rolesLoading}
                  onDeassignClick={openDeassignModal}
                />
              ) : (
                <UserRoleSelectList
                  roles={filteredRoles}
                  loading={rolesLoading}
                  allRoles={allRoles}
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
        disabled={!hasChanges || showAssignedOnly}
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
