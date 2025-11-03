import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import RolesHeader from '../../components/display/roles/shared/Header';
import CategoriesTable from '../../components/display/categories/Table';
import FormModal, { FormFieldConfig } from '../../components/display/shared/modal/FormModal';
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

  const categoryFields: FormFieldConfig[] = [
    {
      type: 'input',
      name: 'name',
      label: 'Category Name',
      placeholder: 'e.g. General',
      required: true,
      marginBottom: 18,
    },
    {
      type: 'input',
      name: 'description',
      label: 'Category Description',
      placeholder: 'e.g. Common roles for everyday access',
      required: true,
      marginBottom: 18,
    },
    {
      type: 'select',
      name: 'type',
      label: 'Category Type',
      placeholder: 'Select a type',
      required: true,
      options: [
        { label: 'Default', value: 'default' },
        { label: 'System', value: 'system' },
        { label: 'Custom', value: 'custom' },
      ],
      marginBottom: 6,
    },
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
          subtitle="Manage existing categories"
          primaryText="Create Category"
          primaryIcon={<AiOutlineFolderOpen size={16} />}
          onPrimary={() => setIsCreateModalOpen(true)}
          breadcrumbs={[{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: 'Categories' }]}
        />

        <FormModal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateCategory}
          title="Create Category"
          subtitle="Add a new role category"
          sectionTitle="Category Details"
          sectionSubtitle="Provide the category information."
          fields={categoryFields}
          buttonText="Create Category"
          buttonIcon={<AiOutlineFolderOpen size={16} />}
          width={360}
          initialValues={{ type: 'default' }}
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


