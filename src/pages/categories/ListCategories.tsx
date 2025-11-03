import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import { ROLE_CATEGORIES_CONSTANTS as RCC } from '../../constants/pages/roleCategories';
import RolesHeader from '../../components/display/roles/shared/Header';
import CategoriesTable from '../../components/display/categories/Table';
import FormModal from '../../components/display/shared/modal/FormModal';
import { STATIC_ROLE_CATEGORIES } from '../../data/roleCategories';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import type { RoleCategory } from '../../interfaces/roles';

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(STATIC_ROLE_CATEGORIES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCategory = async (categoryData: Record<string, any>) => {
    await new Promise((r) => setTimeout(r, 400));
    const newCategory: RoleCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      description: categoryData.description,
      type: categoryData.type,
      usedBy: [],
      createdAt: new Date().toISOString(),
    };
    message.success(`Category "${categoryData.name}" created`);
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
          subtitle={RCC.LABELS.HEADER_SUBTITLE}
          primaryText={RCC.LABELS.FORM.BUTTON_TEXT}
          primaryIcon={<AiOutlineFolderOpen size={16} />}
          onPrimary={() => setIsCreateModalOpen(true)}
          breadcrumbs={[{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: 'Categories' }]}
        />

        <FormModal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateCategory}
          title={RCC.LABELS.FORM.TITLE}
          subtitle={RCC.LABELS.FORM.SUBTITLE}
          sectionTitle={RCC.LABELS.FORM.SECTION_TITLE}
          sectionSubtitle={RCC.LABELS.FORM.SECTION_SUBTITLE}
          fields={RCC.FORM.FIELDS}
          buttonText={RCC.LABELS.FORM.BUTTON_TEXT}
          buttonIcon={<AiOutlineFolderOpen size={16} />}
          width={RCC.SIZES.MODAL_WIDTH}
          initialValues={RCC.FORM.INITIAL_VALUES}
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
