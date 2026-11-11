import React, { useCallback, useMemo, useState } from 'react';
import { Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageLayout } from '../../../../components/display/views';
import { generateActionsColumn } from '../../../../components/display/table/utils';
import { DEFAULT_COLORS, Icons, MENU_LABELS } from '../../../../constants';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import { CATEGORIES_CONSTANTS as CC, labelsFor } from '../constants';
import type { CategoryScope } from '../constants';
import { useCategories, useCategoryListView, useCategoryPermissions } from '../hooks';
import CategoryColumns from '../components/display/list/CategoryColumns';
import { CategoryActionsColumn } from '../components/display/list/CategoryActionsColumn';
import { AddCategoryPanel, EditCategoryPanel } from '../panels';
import type { Category } from '../models';

// Off scale, kept exact: marginTop 22 (XL to XXL).
const EMPTY_ICON = (
  <Icons.Category size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED, marginTop: 22 }} />
);

interface CategoryListPageProps {
  scope: CategoryScope;
  scopeLabel: string;
  tabs: React.ReactNode;
}

const CategoryListPage: React.FC<CategoryListPageProps> = ({ scope, scopeLabel, tabs }) => {
  const L = labelsFor(scope);

  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { categories, loaded, error, refetch } = useCategories(scope);
  const {
    sortKey,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleSort,
    sortedCategories,
    paginatedCategories,
  } = useCategoryListView({ categories });

  const { canAdd } = useCategoryPermissions(scope);

  const openAdd = useCallback(() => setAddPanelOpen(true), []);
  const closeAdd = useCallback(() => setAddPanelOpen(false), []);
  const openEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setEditPanelOpen(true);
  }, []);
  const closeEdit = useCallback(() => {
    setEditPanelOpen(false);
    setEditingCategory(null);
  }, []);

  const config: PageLayoutConfig<Category> = useMemo(
    () => ({
      title: MENU_LABELS.CATEGORIES,
      subtitle: CC.PAGE.SUBTITLE,
      tabs,
      listToolbar: {
        totalCount: sortedCategories.length,
        countSuffix: { one: L.RESOURCE_TYPE, other: L.PLURAL },
        compactWidth: CC.SIZES.TOOLBAR_COMPACT_WIDTH,
        toolbars: [
          {
            buttons: [
              {
                key: 'add',
                label: L.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
                icon: <PlusOutlined />,
                variant: 'primary',
                onClick: openAdd,
                disabled: !canAdd,
                tooltip: canAdd
                  ? undefined
                  : L.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY_DISABLED_TOOLTIP,
              },
            ],
          },
        ],
      },
      columns: [
        ...CategoryColumns({
          activeSortKey: sortKey ?? CC.KEYS.CREATED_AT,
          onSort: handleSort,
          scopeLabel,
        }).map((c) => (c.key === CC.KEYS.NAME ? { ...c, title: L.COLUMNS.NAME } : c)),
        generateActionsColumn<Category>(CC.KEYS.ACTIONS, CC.SIZES.COLUMNS.ACTIONS, (record) => (
          <CategoryActionsColumn record={record} onEdit={openEdit} scope={scope} />
        )),
      ],
      data: paginatedCategories,
      rowKey: (record: Category) => record.id,
      pagination: {
        currentPage,
        pageSize,
        total: sortedCategories.length,
        onPageChange: (page: number) => setCurrentPage(page),
        onPageSizeChange: (size: number) => {
          setPageSize(size);
          setCurrentPage(1);
        },
      },
      empty: <Empty description={L.EMPTY} image={EMPTY_ICON} />,
      loaded,
      error,
      onRetry: refetch,
    }),
    [
      L,
      tabs,
      scope,
      scopeLabel,
      canAdd,
      openAdd,
      openEdit,
      sortKey,
      handleSort,
      sortedCategories.length,
      paginatedCategories,
      currentPage,
      pageSize,
      setCurrentPage,
      setPageSize,
      loaded,
      error,
      refetch,
    ],
  );

  return (
    <>
      <PageLayout config={config} />
      {addPanelOpen && <AddCategoryPanel open={addPanelOpen} onClose={closeAdd} scope={scope} />}
      {editPanelOpen && (
        <EditCategoryPanel
          open={editPanelOpen}
          onClose={closeEdit}
          editingCategory={editingCategory}
        />
      )}
    </>
  );
};

export default CategoryListPage;
