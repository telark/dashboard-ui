import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import RolesHeader from '../../components/display/roles/shared/Header';
import CategoriesTable from '../../components/display/roles/categories/Table';
import { STATIC_ROLE_CATEGORIES } from '../../data/roleCategories';

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(STATIC_ROLE_CATEGORIES);

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
          subtitle="Manage existing categories"
          breadcrumbs={[{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: 'Categories' }]}
        />

        <CategoriesTable
          categories={categories}
          onView={(cat) => message.info(`View category: ${cat.name}`)}
          onCategoriesChange={setCategories}
        />
      </div>
    </div>
  );
};

export default CategoriesList;


