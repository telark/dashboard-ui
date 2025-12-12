import React, { useState, useMemo } from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { FilterPanel } from '../../../../../components/display/panels/filter';
import { FilterButton } from '../../../../../components/display/buttons';
import { SearchInput } from '../../../../../components/display/inputs';
import { Icons } from '../../../../../constants';
import { useAttachRolePanel } from '../../hooks';
import RoleList from '../../components/display/role/RoleList';
import type { Group } from '../../models';
import { buildAttachRoleFilterFields } from '../../config/attachRoleFilterConfig';
import { applyRoleFilters } from '../../utils';
import { useRoleCategoryOptions } from '../../hooks/categories/useRoleCategoryOptions';

const RoleIcon = Icons.Role;

interface AttachRolePanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const AttachRolePanel: React.FC<AttachRolePanelProps> = ({ open, onClose, group }) => {
  const [form] = Form.useForm();
  const currentSelectedRoles = Form.useWatch('assignedRolesIDs', form) || [];
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const FILTER_PANEL_WIDTH = 480;

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

  const filterFields = useMemo(
    () => buildAttachRoleFilterFields(categoryOptions),
    [categoryOptions],
  );

  const filteredRoles = useMemo(
    () => applyRoleFilters(baseFilteredRoles, appliedFilters, searchTerm),
    [baseFilteredRoles, appliedFilters, searchTerm],
  );

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

  if (!currentGroup) return null;

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title="Attach Roles"
        subtitle={`Select roles to attach to ${currentGroup.name}`}
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
                placeholder="Search roles by name, type, status, or validity..."
                minWidth={300}
              />
              <FilterButton onClick={() => setFilterPanelOpen(true)} disabled={filterPanelOpen} />
            </div>
            <div style={{ width: '100%', margin: 0, padding: 0, boxSizing: 'border-box' }}>
              <RoleList roles={filteredRoles} loading={rolesLoading} allRoles={allRoles} />
            </div>
          </div>
        }
        onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
        onCancel={onClose}
        submitButtonText="Attach Roles"
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

export default AttachRolePanel;
