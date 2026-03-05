import React, { useState, useMemo } from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { FilterPanel } from '../../../../../components/display/panels/filter';
import { FilterButton } from '../../../../../components/display/buttons';
import { SearchInput } from '../../../../../components/display/inputs';
import { Icons } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import { useManageUserRolePanel } from '../../hooks/panels/useManageUserRolePanel';
import UserRoleSelectList from '../../components/display/manage/UserRoleSelectList';
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

  const filterFields = useMemo(
    () => buildAttachRoleFilterFields(categoryOptions),
    [categoryOptions],
  );

  const filteredRoles = useMemo(
    () => applyRoleFilters(baseFilteredRoles, appliedFilters, searchTerm),
    [baseFilteredRoles, appliedFilters, searchTerm],
  );

  const handleFilterChange = (filters: Record<string, unknown>) => setAppliedFilters(filters);

  const handleFilterApply = (filters: Record<string, unknown>) => {
    setAppliedFilters(filters);
    setFilterPanelOpen(false);
  };

  const handleFilterReset = () => setAppliedFilters({});

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
              <FilterButton onClick={() => setFilterPanelOpen(true)} disabled={filterPanelOpen} />
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
              <UserRoleSelectList roles={filteredRoles} loading={rolesLoading} allRoles={allRoles} />
            </div>
          </div>
        }
        onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
        onCancel={onClose}
        submitButtonText={UC.LABELS.PANELS.MANAGE_ROLE.SUBMIT_BUTTON}
        submitButtonIcon={<RoleIcon size={16} />}
        loading={submitting}
        disabled={!hasChanges}
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
    </>
  );
};

export default ManageUserRolePanel;
