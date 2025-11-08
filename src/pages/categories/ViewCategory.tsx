import React from 'react';
import { APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_CATEGORIES } from '../../data/categories';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createCategoryViewConfig } from '../../config/categoryViewConfig';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useViewPage } from '../../hooks/useViewPage';
import type { Category } from '../../interfaces/categories';

const CategoryIcon = ICONS.CATEGORY;

const ViewCategory: React.FC = () => {
  const { item: category, config, notFound } = useViewPage<Category>({
    data: STATIC_CATEGORIES,
    findById: (id, data) => data.find((c) => c.id === id),
    createConfig: createCategoryViewConfig,
  });

  if (notFound || !category) {
    return <NotFound message="Category not found" />;
  }

  const breadcrumbs = [
    { label: 'Categories', to: APP_ROUTES.CATEGORIES },
    { label: category.name },
  ];

  return (
    <PageContainer>
      <Header
        subtitle="View category details"
        breadcrumbs={breadcrumbs}
        icon={<CategoryIcon />}
      />

      <AnimatedPageWrapper>
        <ViewDetails config={config} />
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewCategory;
