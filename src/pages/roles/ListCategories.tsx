import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import RolesHeader from '../../components/display/roles/shared/Header';
import CategoriesTable from '../../components/display/roles/categories/Table';
import CreateCategoryModal from '../../components/display/roles/categories/CreateCategoryModal';
import { STATIC_ROLE_CATEGORIES } from '../../data/roleCategories';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import type { RoleCategory } from '../../interfaces/roles';

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(STATIC_ROLE_CATEGORIES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCategory = (categoryData: { name: string; description: string; type: string }) => {
    const newCategory: RoleCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      description: categoryData.description,
      type: categoryData.type,
      usedBy: [],
      createdAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

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
          primaryText="Create Category"
          primaryIcon={<AiOutlineFolderOpen size={16} />}
          onPrimary={() => setIsCreateModalOpen(true)}
          breadcrumbs={[{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: 'Categories' }]}
        />

        <CreateCategoryModal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateCategory}
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


