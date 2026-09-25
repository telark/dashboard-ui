import React, { useCallback, useMemo, useState } from 'react';
import { Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageLayout } from '../../../../components/display/views';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import { DEFAULT_COLORS } from '../../../../constants';
import {
  CATEGORIES_CONSTANTS as CC,
  labelsFor,
} from '../../../access-and-permissions/categories/constants';
import type { CategoryScope } from '../../../access-and-permissions/categories/constants';
import {
  useCategories,
  useCategoryListView,
} from '../../../access-and-permissions/categories/hooks';
import CategoryColumns from '../../../access-and-permissions/categories/components/display/list/CategoryColumns';
import { CategoryActionsColumn } from '../../../access-and-permissions/categories/components/display/list/CategoryActionsColumn';
import {
  AddCategoryPanel,
  EditCategoryPanel,
} from '../../../access-and-permissions/categories/panels';
import type { Category } from '../../../access-and-permissions/categories/models';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

interface PlanTaxonomyPageProps {
  scope: CategoryScope;
  onBack: () => void;
}

const PlanTaxonomyPage: React.FC<PlanTaxonomyPageProps> = ({ scope, onBack }) => {
  const L = labelsFor(scope);
  const viewLabel =
    scope === CC.SCOPES.PLAN_ENVIRONMENTS
      ? PPC.LABELS.TAXONOMY.ENVIRONMENTS
      : PPC.LABELS.TAXONOMY.TAGS;

  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { categories, loading, error } = useCategories(scope);
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

  const canAdd = usePermission(
    ACTION_PERMISSIONS.protectionPlans.addCategory.scope,
    ACTION_PERMISSIONS.protectionPlans.addCategory.level,
    ACTION_PERMISSIONS.protectionPlans.addCategory.deny,
  );

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
      title: '',
      subtitle: PPC.LABELS.HEADER_SUBTITLE,
      breadcrumbs: [{ label: PPC.LABELS.HEADER_TITLE, onClick: onBack }, { label: viewLabel }],
      listToolbar: {
        totalCount: sortedCategories.length,
        countSuffix: { one: L.RESOURCE_TYPE, other: L.PLURAL },
        compactWidth: PPC.LABELS.TOOLBAR_COMPACT_WIDTH,
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
        ...CategoryColumns({ activeSortKey: sortKey ?? CC.KEYS.CREATED_AT, onSort: handleSort })
          .filter((c) => c.key !== CC.KEYS.SCOPE)
          .map((c) => (c.key === CC.KEYS.NAME ? { ...c, title: L.COLUMNS.NAME } : c)),
        {
          title: '',
          key: CC.KEYS.ACTIONS,
          align: 'right' as const,
          width: CC.SIZES.COLUMNS.ACTIONS,
          onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.BACKGROUND_WHITE } }),
          render: (_: unknown, record: Category) => (
            <CategoryActionsColumn record={record} onEdit={openEdit} scope={scope} />
          ),
        },
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
      empty: <Empty description={L.EMPTY} />,
      loading,
      error,
    }),
    [
      L,
      viewLabel,
      onBack,
      scope,
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
      loading,
      error,
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

export default PlanTaxonomyPage;
