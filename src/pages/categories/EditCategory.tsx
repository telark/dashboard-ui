import React from 'react';
import { Form } from 'antd';
import { APP_ROUTES, ICONS, BUTTON_TEXTS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_CATEGORIES } from '../../data/categories';
import { CATEGORIES_CONSTANTS as CC } from '../../constants/pages/categories';
import LabeledInput from '../../components/display/shared/inputs/LabeledInput';
import LabeledSelect from '../../components/display/shared/inputs/LabeledSelect';
import Section from '../../components/display/roles/shared/Section';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useEditPage } from '../../hooks/useEditPage';
import type { Category } from '../../interfaces/categories';

const CategoryIcon = ICONS.CATEGORY;

interface EditCategoryFormValues {
  name: string;
  description: string;
  type: string;
}

const EditCategory: React.FC = () => {
  const {
    item: category,
    form,
    submitting,
    handleFinish,
    notFound,
  } = useEditPage<Category, EditCategoryFormValues>({
    data: STATIC_CATEGORIES,
    findById: (id, data) => data.find((c) => c.id === id),
    getFormValues: (item) => ({
      name: item.name,
      description: item.description,
      type: item.type,
    }),
    onUpdate: async () => {
      await new Promise((r) => setTimeout(r, 400));
    },
    successMessage: CC.LABELS.MESSAGES.UPDATED,
    viewRoute: (id) => `${APP_ROUTES.CATEGORIES}/${id}/view`,
  });

  if (notFound || !category) {
    return <NotFound message={CC.LABELS.NOT_FOUND} />;
  }

  const breadcrumbs = [
    { label: CC.LABELS.BREADCRUMBS.CATEGORIES, to: APP_ROUTES.CATEGORIES },
    { label: category.name },
    { label: CC.LABELS.BREADCRUMBS.EDIT },
  ];

  return (
    <PageContainer>
      <Header
        subtitle={CC.LABELS.EDIT_SUBTITLE}
        breadcrumbs={breadcrumbs}
        icon={<CategoryIcon />}
      />

      <AnimatedPageWrapper>
        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<EditCategoryFormValues> layout="vertical" form={form} onFinish={handleFinish}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                width: '100%',
              }}
            >
              <Section
                title={CC.LABELS.FORM.SECTION_TITLE}
                subtitle={CC.LABELS.FORM.SECTION_SUBTITLE}
                content={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <LabeledInput
                      name="name"
                      label={CC.LABELS.FORM.FIELDS.NAME_LABEL}
                      required
                      placeholder={CC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER}
                      marginBottom={18}
                    />
                    <LabeledInput
                      name="description"
                      label={CC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
                      required
                      placeholder={CC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
                      marginBottom={18}
                    />
                    <LabeledSelect
                      name="type"
                      label={CC.LABELS.FORM.FIELDS.TYPE_LABEL}
                      placeholder={CC.LABELS.FORM.FIELDS.TYPE_PLACEHOLDER}
                      required
                      options={[
                        { label: 'Default', value: 'default' },
                        { label: 'System', value: 'system' },
                        { label: 'Custom', value: 'custom' },
                      ]}
                      marginBottom={6}
                    />
                  </div>
                }
              />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                  <PrimaryButton
                    action="Update Category"
                    loading={submitting}
                    loadingLabel={BUTTON_TEXTS.LOADING}
                    onClick={() => form.submit()}
                    icon={<CategoryIcon size={16} />}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default EditCategory;
