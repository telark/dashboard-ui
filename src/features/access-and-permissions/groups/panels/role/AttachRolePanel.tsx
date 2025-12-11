import React, { useState, useMemo } from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { FilterPanel, type FilterField } from '../../../../../components/display/panels/filter';
import { Icons } from '../../../../../constants';
import { useAttachRolePanel } from '../../hooks';
import RoleTypeFilter from '../../components/display/role/RoleTypeFilter';
import RoleList from '../../components/display/role/RoleList';
import type { Group } from '../../models';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ValidityType } from '../../../roles/models/types';

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
  const FILTER_PANEL_WIDTH = 480;

  const {
    currentGroup,
    initialSelectedRoles,
    hasChanges,
    filteredRoles: baseFilteredRoles,
    allRoles,
    rolesLoading,
    submitting,
    selectedRoleType,
    setSelectedRoleType,
    handleSubmit,
  } = useAttachRolePanel({
    open,
    group,
    form,
    onClose,
    currentSelectedRoles,
  });

  // Filter fields configuration
  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'dateRange',
        label: 'DATE FILTER',
        type: 'dateRange',
        fromLabel: 'Created From',
        toLabel: 'Created To',
      },
      {
        key: 'type',
        label: 'BY VALIDITY',
        type: 'buttonGroup',
        options: [
          { key: 'all', label: 'All' },
          { key: 'permanent', label: 'Permanent' },
          { key: 'temporary', label: 'Temporary' },
          { key: 'sessionBased', label: 'Session-based' },
        ],
        defaultValue: 'all',
      },
      {
        key: 'status',
        label: 'BY STATUS',
        type: 'buttonGroup',
        options: [
          { key: 'all', label: 'All' },
          { key: 'Active', label: 'Active' },
          { key: 'Inactive', label: 'Inactive' },
        ],
        defaultValue: 'all',
      },
    ],
    [],
  );

  // Apply additional filters from filter panel
  const filteredRoles = useMemo(() => {
    let roles = baseFilteredRoles || [];

    // Apply date range filter
    const dateRange = appliedFilters.dateRange as
      | { from?: Dayjs | null; to?: Dayjs | null }
      | undefined;
    if (dateRange?.from || dateRange?.to) {
      const from = dateRange.from ? dayjs(dateRange.from).startOf('day') : null;
      const to = dateRange.to ? dayjs(dateRange.to).endOf('day') : null;

      roles = roles.filter((role) => {
        const roleDate = dayjs(role.creationDate);
        if (from && roleDate.isBefore(from)) return false;
        if (to && roleDate.isAfter(to)) return false;
        return true;
      });
    }

    // Apply validity filter
    const filterValidity = appliedFilters.type as ValidityType | 'all' | undefined;
    if (filterValidity && filterValidity !== 'all') {
      roles = roles.filter((role) => role.validity?.type === filterValidity);
    }

    // Apply status filter
    const filterStatus = appliedFilters.status as string | undefined;
    if (filterStatus && filterStatus !== 'all') {
      roles = roles.filter((role) => role.status === filterStatus);
    }

    return roles;
  }, [baseFilteredRoles, appliedFilters]);

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
            <RoleTypeFilter
              selectedRoleType={selectedRoleType}
              onTypeChange={setSelectedRoleType}
              onFilterClick={() => setFilterPanelOpen(true)}
            />
            <RoleList roles={filteredRoles} loading={rolesLoading} allRoles={allRoles} />
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
