import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES, ICONS } from '../../constants';
import { CATEGORIES_CONSTANTS as CC } from '../../constants/pages/categories';
import RolesHeader from '../../components/display/roles/shared/Header';
import CategoriesTable from '../../components/display/categories/Table';
import FormModal from '../../components/display/shared/modal/FormModal';
import { STATIC_CATEGORIES } from '../../data/categories';
import type { Category } from '../../interfaces/categories';

const CategoryIcon = ICONS.CATEGORY;

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(STATIC_CATEGORIES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateCategory = async (categoryData: Record<string, any>) => {
    await new Promise((r) => setTimeout(r, 400));
    const newCategory: Category = {
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
          subtitle={CC.LABELS.HEADER_SUBTITLE}
          primaryText={CC.LABELS.FORM.BUTTON_TEXT}
          primaryIcon={<CategoryIcon size={16} />}
          onPrimary={() => setIsCreateModalOpen(true)}
          breadcrumbs={[{ label: 'Categories' }]}
        />

        <FormModal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateCategory}
          title={CC.LABELS.FORM.TITLE}
          subtitle={CC.LABELS.FORM.SUBTITLE}
          sectionTitle={CC.LABELS.FORM.SECTION_TITLE}
          sectionSubtitle={CC.LABELS.FORM.SECTION_SUBTITLE}
          fields={CC.FORM.FIELDS}
          buttonText={CC.LABELS.FORM.BUTTON_TEXT}
          buttonIcon={<CategoryIcon size={16} />}
          width={CC.SIZES.MODAL_WIDTH}
          initialValues={CC.FORM.INITIAL_VALUES}
        />

        <CategoriesTable
          categories={categories}
          onView={(cat) => navigate(`${APP_ROUTES.CATEGORIES}/${cat.id}/view`)}
          onCategoriesChange={setCategories}
        />
      </div>
    </div>
  );
};

export default CategoriesList;
