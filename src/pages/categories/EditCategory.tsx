import React, { useMemo, useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES, ICONS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_CATEGORIES } from '../../data/categories';
import { CATEGORIES_CONSTANTS as CC } from '../../constants/pages/categories';
import LabeledInput from '../../components/display/shared/inputs/LabeledInput';
import LabeledSelect from '../../components/display/shared/inputs/LabeledSelect';
import Section from '../../components/display/roles/shared/Section';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { BUTTON_TEXTS } from '../../constants';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';

const CategoryIcon = ICONS.CATEGORY;

interface EditCategoryFormValues {
  name: string;
  description: string;
  type: string;
}

const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<EditCategoryFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const category = useMemo(() => {
    return STATIC_CATEGORIES.find((c) => c.id === id);
  }, [id]);

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        type: category.type,
      });
    }
  }, [category, form]);

  if (!category) {
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

  const handleFinish = async (values: EditCategoryFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(`Category "${values.name}" updated`);
      navigate(`${APP_ROUTES.CATEGORIES}/${id}/view`);
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Categories', to: APP_ROUTES.CATEGORIES },
    { label: category.name },
    { label: 'Edit' },
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
        <Header
          subtitle="Edit category details"
          breadcrumbs={breadcrumbs}
          primaryText="Back to Categories"
          onPrimary={() => navigate(APP_ROUTES.CATEGORIES)}
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
            <Form<EditCategoryFormValues>
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              initialValues={{
                name: category.name,
                description: category.description,
                type: category.type,
              }}
            >
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
      </div>
    </div>
  );
};

export default EditCategory;

