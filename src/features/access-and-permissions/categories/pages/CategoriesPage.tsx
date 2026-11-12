import React, { useCallback, useMemo } from 'react';
import { Segmented } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { NoPermissionCard, PageContainer } from '../../../../components/shared';
import { MENU_LABELS } from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { CATEGORIES_CONSTANTS as CC } from '../constants';
import type { CategoryScope } from '../constants';
import { useCategoryPermissions } from '../hooks';
import CategoryListPage from './CategoryListPage';

const TAB_OPTIONS = CC.PAGE.TABS.map(({ value, label }) => ({ value, label }));
const [DEFAULT_TAB] = CC.PAGE.TABS;

const CategoriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get(CC.PAGE.TYPE_PARAM);
  const tab = CC.PAGE.TABS.find(({ value }) => value === type) ?? DEFAULT_TAB;
  const { canView, viewPermission } = useCategoryPermissions(tab.value);

  const onChange = useCallback(
    (next: CategoryScope) => setSearchParams({ [CC.PAGE.TYPE_PARAM]: next }),
    [setSearchParams],
  );
  const tabs = useMemo(
    () => (
      <div className="tk-scroll-hidden" style={{ overflowX: 'auto' }}>
        <Segmented<CategoryScope> value={tab.value} onChange={onChange} options={TAB_OPTIONS} />
      </div>
    ),
    [tab.value, onChange],
  );

  if (!canView) {
    return (
      <PageContainer
        title={MENU_LABELS.CATEGORIES}
        subtitle={CC.PAGE.SUBTITLE}
        gap={LIST_PAGE.CONTENT_GAP_PX}
      >
        {tabs}
        <NoPermissionCard featureName={tab.featureName} permission={viewPermission} />
      </PageContainer>
    );
  }

  // Keyed so sorting, paging and open panels never carry over to another type.
  return <CategoryListPage key={tab.value} scope={tab.value} scopeLabel={tab.label} tabs={tabs} />;
};

export default CategoriesPage;
