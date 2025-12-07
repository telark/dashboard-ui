import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { APP_ROUTES, Icons, SHARED_DETAILS_CONSTANTS, DEFAULT_COLORS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { PageLayout } from '../../../../components/display/views';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import EmptyState from '../../../../components/display/views/EmptyState';
import { FancySpinner } from '../../../../components/animation';
import { useGroups } from '../hooks';
import { useGroupActions } from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { selectGroupsCategories } from '../../categories/store/selectors/categorySelectors';
import Columns from '../components/display/list/Columns';
import ActionBar from '../../../../components/display/actions/ActionBar';
import type { Group } from '../models';
import { EyeOutlined, EditOutlined, SearchOutlined, AppstoreOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';

const GroupIcon = Icons.Group;

type SortKey = 'name' | 'categoryID' | 'creationDate';

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const { groups, loading, error } = useGroups();
  const { handleDelete } = useGroupActions();
  const { loading: categoriesLoading, categories } = useCategories(
    CATEGORIES_CONSTANTS.SCOPES.GROUPS,
  );
  const reduxCategories = useSelector(selectGroupsCategories);

  const [sortKey, setSortKey] = useState<SortKey>('creationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedGroups, setSelectedGroups] = useState<React.Key[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const isFetching = groups === undefined || loading || categoriesLoading;
  const shouldShowEmpty = Array.isArray(groups) && groups.length === 0 && !error;

  // Filter by category
  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    if (selectedCategory === 'all') return groups;
    return groups.filter((group) => group.categoryID === selectedCategory);
  }, [groups, selectedCategory]);

  // Sort groups
  const sortedGroups = useMemo(() => {
    const items = [...filteredGroups];
    const compare = (a: Group, b: Group) => {
      switch (sortKey) {
        case 'name':
          return String(a.name).localeCompare(String(b.name));
        case 'categoryID':
          return String(a.categoryID).localeCompare(String(b.categoryID));
        case 'creationDate':
        default:
          return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
  }, [filteredGroups, sortKey, sortOrder]);

  // Paginate groups
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedGroups.slice(start, end);
  }, [sortedGroups, currentPage, pageSize]);

  const selectedCount = selectedGroups.length;
  const hasSelection = selectedCount > 0;

  const handleView = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = groups?.find((g) => g.id === selectedId);
      if (selectedGroup) {
        navigate(`${APP_ROUTES.GROUPS}/${selectedGroup.id}/view`);
      }
    }
  }, [selectedCount, selectedGroups, groups, navigate]);

  const handleEdit = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = selectedGroups[0] as string;
      const selectedGroup = groups?.find((g) => g.id === selectedId);
      if (selectedGroup) {
        navigate(`${APP_ROUTES.GROUPS}/${selectedGroup.id}/edit`);
      }
    }
  }, [selectedCount, selectedGroups, groups, navigate]);

  const handleDeleteClick = useCallback(() => {
    const selectedIds = selectedGroups as string[];
    if (selectedIds.length === 0) return;

    const selectedGroupNames = selectedIds
      .map((id) => groups?.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];

    Modal.confirm({
      title: GC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
      content: GC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(
        selectedGroupNames.length === 1
          ? selectedGroupNames[0]
          : `${selectedGroupNames.length} groups`,
      ),
      okText: GC.LABELS.ACTIONS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: async () => {
        for (const id of selectedIds) {
          const group = groups?.find((g) => g.id === id);
          if (group) {
            try {
              await handleDelete(id);
            } catch {
              // Error message already shown by handleDelete
            }
          }
        }
        setSelectedGroups([]);
      },
    });
  }, [selectedGroups, groups, handleDelete]);

  // Category filter options
  const categoryFilterOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All' }];
    if (reduxCategories && reduxCategories.length > 0) {
      reduxCategories.forEach((category) => {
        options.push({ value: category.id, label: category.name });
      });
    }
    return options;
  }, [reduxCategories]);

  // Generate columns
  const columns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey,
        onSort: (k: string) => {
          const key = k as SortKey;
          setSortKey(key);
          setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        },
        categories: reduxCategories,
      } as any),
    [sortKey, reduxCategories],
  );

  // PageLayout config - must be before any early returns
  const pageConfig: PageLayoutConfig<Group> = useMemo(
    () => ({
      title: GC.LABELS.HEADER_TITLE,
      subtitle: GC.LABELS.HEADER_SUBTITLE,
      filterSection: {
        label: 'Categories',
        options: categoryFilterOptions,
        selectedValue: selectedCategory,
        onChange: (value: string) => {
          setSelectedCategory(value);
          setCurrentPage(1);
        },
      },
      toolbar: {
        buttons: [
          {
            key: 'search',
            label: 'Search',
            icon: <SearchOutlined />,
            variant: 'ghost',
            onClick: () => {
              // TODO: Implement search functionality
              console.log('Search clicked');
            },
          },
          {
            key: 'filter',
            label: 'Filter',
            icon: <FilterOutlined />,
            variant: 'ghost',
            onClick: () => {
              // TODO: Implement filter functionality
              console.log('Filter clicked');
            },
          },
          {
            key: 'manage-categories',
            label: 'Manage Categories',
            icon: <AppstoreOutlined />,
            variant: 'default',
            dropdown: {
              items: [
                {
                  key: 'view-categories',
                  label: 'View Categories',
                  icon: <AppstoreOutlined />,
                },
                {
                  key: 'add-category',
                  label: 'Add Category',
                  icon: <PlusOutlined />,
                },
              ],
              onItemClick: (key: string) => {
                if (key === 'view-categories') {
                  // TODO: Navigate to view categories page
                  console.log('View categories clicked');
                } else if (key === 'add-category') {
                  // TODO: Open add category modal or navigate to create category page
                  console.log('Add category clicked');
                }
              },
            },
          },
          {
            key: 'create-group',
            label: GC.LABELS.FORM.BUTTON_TEXT,
            icon: <GroupIcon size={14} />,
            variant: 'primary',
            onClick: () => navigate(APP_ROUTES.GROUP_CREATE),
          },
        ],
      },
      columns: [
        ...columns,
        {
          title: '',
          key: 'actions',
          align: 'right' as const,
          width: 120,
          onHeaderCell: () => ({ style: { background: '#fff' } }),
          render: (_: unknown, record: Group) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${APP_ROUTES.GROUPS}/${record.id}/view`);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: 16,
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0fdfa';
                  e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <EyeOutlined />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${APP_ROUTES.GROUPS}/${record.id}/edit`);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: 16,
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0fdfa';
                  e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <EditOutlined />
              </button>
            </div>
          ),
        },
      ],
      data: paginatedGroups,
      rowKey: (record: Group) => record.id,
      containerStyle: {
        marginTop: hasSelection ? '0' : undefined,
        paddingBottom: '48px',
      },
      pagination: {
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
      },
      rowSelection: {
        selectedRowKeys: selectedGroups,
        onChange: (keys: React.Key[]) => {
          setSelectedGroups(keys);
        },
      },
      onRowClick: (record: Group) => {
        navigate(`${APP_ROUTES.GROUPS}/${record.id}/view`);
      },
      rowHeight: GC.SIZES.ROW_HEIGHT,
    }),
    [
      categoryFilterOptions,
      selectedCategory,
      columns,
      paginatedGroups,
      currentPage,
      pageSize,
      sortedGroups.length,
      selectedGroups,
      navigate,
      hasSelection,
    ],
  );

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

  // Empty state
  if (shouldShowEmpty) {
    return (
      <EmptyState
        title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
        description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
        buttonText={GC.LABELS.FORM.BUTTON_TEXT}
        buttonIcon={<GroupIcon size={16} />}
        onButtonClick={() => navigate(APP_ROUTES.GROUP_CREATE)}
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
      {hasSelection && (
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
      )}
      <PageLayout config={pageConfig} />
    </div>
  );
};

export default GroupsList;
