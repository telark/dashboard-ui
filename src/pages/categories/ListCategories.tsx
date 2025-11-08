import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS } from '../../constants';
import { CATEGORIES_CONSTANTS as CC } from '../../constants/pages/categories';
import Header from '../../components/display/shared/sections/Header';
import CategoriesTable from '../../components/display/categories/list/Table';
import FormModal from '../../components/display/shared/modal/FormModal';
import { STATIC_CATEGORIES } from '../../data/categories';
import { PageContainer } from '../../components/shared';
import { useListPage } from '../../hooks/useListPage';
import type { Category } from '../../interfaces/categories';

const CategoryIcon = ICONS.CATEGORY;

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const { items: categories, setItems: setCategories, isCreateModalOpen, setIsCreateModalOpen, handleCreate } = useListPage<Category>({
    initialData: STATIC_CATEGORIES,
    onCreate: async (categoryData) => {
      await new Promise((r) => setTimeout(r, 400));
      return {
        id: `cat-${Date.now()}`,
        name: categoryData.name,
        description: categoryData.description,
        type: categoryData.type,
        usedBy: [],
        createdAt: new Date().toISOString(),
      } as Category;
    },
    successMessage: CC.LABELS.MESSAGES.CREATED,
  });

  return (
    <PageContainer>
        <Header
          subtitle={CC.LABELS.HEADER_SUBTITLE}
          primaryText={CC.LABELS.FORM.BUTTON_TEXT}
          primaryIcon={<CategoryIcon size={16} />}
          onPrimary={() => setIsCreateModalOpen(true)}
          breadcrumbs={[{ label: CC.LABELS.BREADCRUMBS.CATEGORIES }]}
          icon={<CategoryIcon />}
        />

      <FormModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreate}
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
        onEdit={(cat) => navigate(`${APP_ROUTES.CATEGORIES}/${cat.id}/edit`)}
        onCategoriesChange={setCategories}
      />
    </PageContainer>
  );
};

export default CategoriesList;
