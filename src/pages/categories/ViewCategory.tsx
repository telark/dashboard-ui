import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import RolesHeader from '../../components/display/roles/shared/Header';
import { STATIC_CATEGORIES } from '../../data/categories';
import ViewDetails from '../../components/display/shared/ViewDetails';
import { createCategoryViewConfig } from '../../config/categoryViewConfig';

const ViewCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const category = useMemo(() => {
    return STATIC_CATEGORIES.find((c) => c.id === id);
  }, [id]);

  const config = useMemo(() => {
    if (!category) return null;
    return createCategoryViewConfig(category);
  }, [category]);

  if (!category || !config) {
    return (
      <div
        style={{
          padding: '48px 24px 24px',
          marginTop: '60px',
          background: DEFAULT_COLORS.PAGE_BG,
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <div>Category not found</div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Categories', to: APP_ROUTES.CATEGORIES },
    { label: category.name },
  ];

  return (
    <div
      style={{
        padding: '48px 24px 24px',
        marginTop: '60px',
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: 'calc(100vh - 60px)',
      }}
      className="app-root"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <RolesHeader
          subtitle="View category details"
          breadcrumbs={breadcrumbs}
          primaryText="Back to Categories"
          onPrimary={() => navigate(APP_ROUTES.CATEGORIES)}
        />

        <ViewDetails config={config} />
      </div>
    </div>
  );
};

export default ViewCategory;

