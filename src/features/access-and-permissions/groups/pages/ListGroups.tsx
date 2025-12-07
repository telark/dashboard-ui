import React, { useMemo, useState } from 'react';
import { Activity } from 'react';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { Icons, SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { PageLayout } from '../../../../components/display/views';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import EmptyState from '../../../../components/display/views/EmptyState';
import { FancySpinner } from '../../../../components/animation';
import { useGroups, useGroupActions, useGroupListState, useGroupListActions } from '../hooks';
import { useCategories, useCategoryListView } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { selectGroupsCategories } from '../../categories/store/selectors/categorySelectors';
import Columns from '../components/display/list/Columns';
import CategoryColumns from '../../categories/components/display/list/CategoryColumns';
import { CategoryActionsColumn } from '../../categories/components/display/list/CategoryActionsColumn';
import { GroupActionsColumn } from '../components/display/list/GroupActionsColumn';
import ActionBar from '../../../../components/display/actions/ActionBar';
import { useGroupListConfig } from '../config/groupListConfig';
import { mapCategoriesToFilterOptions } from '../utils/groupListUtils';
import type { Group } from '../models';
import type { Category } from '../../categories/models';
import { SlideOutPanel } from '../../../../components/display/panels/slide-out';
import { useGroupNameValidation, useGroupCategories, useGroupFormState } from '../hooks';
import { useUsers } from '../../users/hooks';
import { useRoles } from '../../roles/hooks';
import GroupFormFields from '../components/display/shared/GroupFormFields';
import type { GroupFormData } from '../models';

const GroupIcon = Icons.Group;

type ViewMode = 'groups' | 'categories';

const GroupsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const [createPanelOpen, setCreatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [createForm] = Form.useForm<GroupFormData>();
  const [editForm] = Form.useForm<GroupFormData>();
  const { groups, loading, error } = useGroups();
  const { handleCreate, handleUpdate, handleDelete, submitting } = useGroupActions();
  const { categories, loading: categoriesLoading } = useCategories(
    CATEGORIES_CONSTANTS.SCOPES.GROUPS,
  );
  const reduxCategories = useSelector(selectGroupsCategories);
  const { categoryOptions, defaultCategoryId } = useGroupCategories();
  const { users } = useUsers();
  const { roles } = useRoles();
  const { nameValidator: createNameValidator, normalizeName: createNormalizeName } =
    useGroupNameValidation({
      groups,
      isEditMode: false,
    });
  const { nameValidator: editNameValidator, normalizeName: editNormalizeName } =
    useGroupNameValidation({
      groups,
      isEditMode: true,
      currentName: editingGroup?.name,
    });
  const {
    handleValuesChange: handleCreateValuesChange,
    handleFieldsChange: handleCreateFieldsChange,
    hasFormErrors: hasCreateFormErrors,
  } = useGroupFormState({
    form: createForm,
    isEditMode: false,
  });
  const {
    handleValuesChange: handleEditValuesChange,
    handleFieldsChange: handleEditFieldsChange,
    hasFormErrors: hasEditFormErrors,
    hasChanges,
  } = useGroupFormState({
    form: editForm,
    isEditMode: true,
    initialValues: editingGroup
      ? {
          name: editingGroup.name,
          description: editingGroup.description,
          categoryID: editingGroup.categoryID,
        }
      : null,
  });

  const userOptions = useMemo(
    () =>
      users?.map((user) => ({
        label: user.fullname || user.username,
        value: user.id,
      })) || [],
    [users],
  );

  const roleOptions = useMemo(
    () =>
      roles?.map((role) => ({
        label: role.name,
        value: role.id,
      })) || [],
    [roles],
  );

  const {
    sortKey,
    selectedGroups,
    selectedCategory,
    currentPage,
    pageSize,
    setSelectedCategory,
    setCurrentPage,
    setPageSize,
    setSelectedGroups,
    handleSort,
    sortedGroups,
    paginatedGroups,
    selectedCount,
    hasSelection,
  } = useGroupListState(groups);

  const [selectedCategories, setSelectedCategories] = useState<React.Key[]>([]);

  const {
    sortKey: categorySortKey,
    currentPage: categoryCurrentPage,
    pageSize: categoryPageSize,
    setCurrentPage: setCategoryCurrentPage,
    setPageSize: setCategoryPageSize,
    handleSort: handleCategorySort,
    sortedCategories,
    paginatedCategories,
  } = useCategoryListView({ categories });

  const handleEditClick = (group: Group) => {
    setEditingGroup(group);
    setEditPanelOpen(true);
  };

  const { handleView, handleEdit, handleDeleteClick, handleViewGroup } = useGroupListActions({
    selectedGroups,
    groups,
    handleDelete,
    setSelectedGroups,
    onEdit: handleEditClick,
  });

  const categoryFilterOptions = useMemo(
    () => mapCategoriesToFilterOptions(reduxCategories),
    [reduxCategories],
  );

  const { filterSectionConfig, toolbarConfig } = useGroupListConfig({
    categoryFilterOptions,
    selectedCategory,
    onCategoryChange: (value: string) => {
      setSelectedCategory(value);
      setCurrentPage(1);
    },
    viewMode,
    onViewModeChange: setViewMode,
    onCreateGroupClick: () => setCreatePanelOpen(true),
  });

  const handleCreateGroup = async (values: GroupFormData) => {
    await handleCreate(values);
    createForm.resetFields();
    setCreatePanelOpen(false);
  };

  const handleCreateGroupSubmit = async (values: Record<string, unknown>) => {
    await handleCreateGroup(values as GroupFormData);
  };

  const handleEditGroup = async (values: GroupFormData) => {
    if (!editingGroup) return;
    await handleUpdate(editingGroup.id, values);
    editForm.resetFields();
    setEditPanelOpen(false);
    setEditingGroup(null);
  };

  const handleEditGroupSubmit = async (values: Record<string, unknown>) => {
    await handleEditGroup(values as GroupFormData);
  };

  // Generate columns for groups
  const groupColumns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey,
        onSort: handleSort,
        categories: reduxCategories,
      }),
    [sortKey, reduxCategories, handleSort],
  );

  // Generate columns for categories
  const categoryColumns = useMemo(
    () =>
      CategoryColumns({
        activeSortKey: categorySortKey,
        onSort: handleCategorySort,
      }),
    [categorySortKey, handleCategorySort],
  );

  // Breadcrumbs based on view mode - used in title
  const breadcrumbs = useMemo(() => {
    if (viewMode === 'categories') {
      return [
        { label: GC.LABELS.BREADCRUMBS.GROUPS, onClick: () => setViewMode('groups') },
        { label: 'Categories' },
      ];
    }
    return [];
  }, [viewMode]);

  // Single page config that changes only columns based on view mode
  const pageConfig: PageLayoutConfig<Group | Category> = useMemo(
    () => ({
      title: GC.LABELS.HEADER_TITLE,
      subtitle: GC.LABELS.HEADER_SUBTITLE,
      breadcrumbs,
      filterSection: filterSectionConfig,
      toolbar: toolbarConfig,
      columns:
        viewMode === 'groups'
          ? [
              ...groupColumns,
              {
                title: '',
                key: 'actions',
                align: 'right' as const,
                width: 120,
                onHeaderCell: () => ({ style: { background: '#fff' } }),
                render: (_: unknown, record: Group | Category) =>
                  viewMode === 'groups' ? (
                    <GroupActionsColumn record={record as Group} onEdit={handleEditClick} />
                  ) : null,
              },
            ]
          : [
              ...categoryColumns,
              {
                title: '',
                key: 'actions',
                align: 'right' as const,
                width: 120,
                onHeaderCell: () => ({ style: { background: '#fff' } }),
                render: (_: unknown, record: Group | Category) => (
                  <CategoryActionsColumn
                    record={record as Category}
                    onEdit={(cat) => {
                      // TODO: Implement edit category
                      console.log('Edit category:', cat);
                    }}
                    onDelete={(cat) => {
                      // TODO: Implement delete category
                      console.log('Delete category:', cat);
                    }}
                  />
                ),
              },
            ],
      data: (viewMode === 'groups' ? paginatedGroups : paginatedCategories) as (Group | Category)[],
      rowKey: (record: Group | Category) => record.id,
      containerStyle: {
        marginTop: viewMode === 'groups' && hasSelection ? '0' : undefined,
        paddingBottom: '48px',
      },
      pagination:
        viewMode === 'groups'
          ? {
              currentPage,
              pageSize,
              total: sortedGroups.length,
              onPageChange: (page: number) => setCurrentPage(page),
              onPageSizeChange: (size: number) => {
                setPageSize(size);
                setCurrentPage(1);
              },
              pageSizeOptions: [10, 20, 50, 100],
              showRowsLabel: 'Show rows',
            }
          : {
              currentPage: categoryCurrentPage,
              pageSize: categoryPageSize,
              total: sortedCategories.length,
              onPageChange: (page: number) => setCategoryCurrentPage(page),
              onPageSizeChange: (size: number) => {
                setCategoryPageSize(size);
                setCategoryCurrentPage(1);
              },
              pageSizeOptions: [10, 20, 50, 100],
              showRowsLabel: 'Show rows',
            },
      rowSelection:
        viewMode === 'groups'
          ? {
              selectedRowKeys: selectedGroups,
              onChange: (keys: React.Key[]) => {
                setSelectedGroups(keys);
              },
            }
          : {
              selectedRowKeys: selectedCategories,
              onChange: (keys: React.Key[]) => {
                setSelectedCategories(keys);
              },
            },
      onRowClick:
        viewMode === 'groups'
          ? (record: Group | Category) => handleViewGroup(record as Group)
          : undefined,
      rowHeight: GC.SIZES.ROW_HEIGHT,
    }),
    [
      breadcrumbs,
      filterSectionConfig,
      toolbarConfig,
      viewMode,
      groupColumns,
      categoryColumns,
      paginatedGroups,
      paginatedCategories,
      currentPage,
      pageSize,
      sortedGroups.length,
      categoryCurrentPage,
      categoryPageSize,
      sortedCategories.length,
      selectedGroups,
      selectedCategories,
      hasSelection,
      handleViewGroup,
      setCurrentPage,
      setPageSize,
      setCategoryCurrentPage,
      setCategoryPageSize,
      setSelectedGroups,
      setSelectedCategories,
    ],
  );

  const isFetching = groups === undefined || loading || categoriesLoading;
  const shouldShowEmpty = Array.isArray(groups) && groups.length === 0 && !error;

  // Error state
  if (error) {
    return (
      <div
        style={{
          background: '#fff',
          minHeight: 'calc(100vh - 60px)',
          padding: '48px 32px 32px',
          marginTop: '60px',
        }}
      >
        <div>Error: {error}</div>
      </div>
    );
  }

  // Empty state (only for groups view)
  if (shouldShowEmpty && viewMode === 'groups') {
    return (
      <EmptyState
        title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
        description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
        buttonText={GC.LABELS.FORM.BUTTON_TEXT}
        buttonIcon={<GroupIcon size={16} />}
        onButtonClick={() => setCreatePanelOpen(true)}
        icon={<GroupIcon size={40} />}
      />
    );
  }

  // Loading state
  if (isFetching) {
    return (
      <div
        style={{
          background: '#fff',
          minHeight: 'calc(100vh - 60px)',
          padding: '48px 32px 32px',
          marginTop: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FancySpinner label={SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING} showLabel={true} />
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Activity mode={viewMode === 'groups' && hasSelection ? 'visible' : 'hidden'}>
        <div
          style={{
            background: '#fff',
            padding: '16px 32px',
            marginTop: '60px',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: '60px',
            zIndex: 10,
          }}
        >
          <ActionBar
            selectedCount={selectedCount}
            hasSelection={hasSelection}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      </Activity>
      <PageLayout config={pageConfig} />
      <SlideOutPanel
        open={createPanelOpen}
        onClose={() => setCreatePanelOpen(false)}
        title={GC.LABELS.FORM.TITLE}
        formContent={
          <GroupFormFields
            nameValidator={createNameValidator}
            normalizeName={createNormalizeName}
            categoryOptions={categoryOptions}
            userOptions={userOptions}
            roleOptions={roleOptions}
          />
        }
        onSubmit={handleCreateGroupSubmit}
        onCancel={() => setCreatePanelOpen(false)}
        submitButtonText={GC.LABELS.FORM.BUTTON_TEXT}
        submitButtonIcon={<GroupIcon size={16} />}
        loading={submitting}
        disabled={hasCreateFormErrors}
        initialValues={{
          name: '',
          description: '',
          categoryID: defaultCategoryId,
          memberIDs: [],
          roleIDs: [],
        }}
        onValuesChange={handleCreateValuesChange}
        onFieldsChange={handleCreateFieldsChange}
      />
      <SlideOutPanel
        open={editPanelOpen}
        onClose={() => {
          setEditPanelOpen(false);
          setEditingGroup(null);
          editForm.resetFields();
        }}
        title="Edit Group"
        formContent={
          editingGroup ? (
            <GroupFormFields
              nameValidator={editNameValidator}
              normalizeName={editNormalizeName}
              categoryOptions={categoryOptions}
              userOptions={userOptions}
              roleOptions={roleOptions}
            />
          ) : null
        }
        onSubmit={handleEditGroupSubmit}
        onCancel={() => {
          setEditPanelOpen(false);
          setEditingGroup(null);
          editForm.resetFields();
        }}
        submitButtonText="Update Group"
        submitButtonIcon={<GroupIcon size={16} />}
        loading={submitting}
        disabled={hasEditFormErrors || !hasChanges}
        initialValues={
          editingGroup
            ? {
                name: editingGroup.name,
                description: editingGroup.description,
                categoryID: editingGroup.categoryID,
                memberIDs: [],
                roleIDs: [],
              }
            : {}
        }
        onValuesChange={handleEditValuesChange}
        onFieldsChange={handleEditFieldsChange}
      />
    </div>
  );
};

export default GroupsList;
