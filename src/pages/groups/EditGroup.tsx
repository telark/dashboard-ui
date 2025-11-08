import React, { useMemo, useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES, ICONS, BUTTON_TEXTS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_GROUPS } from '../../data/groups';
import { GROUPS_CONSTANTS as GC } from '../../constants/pages/groups';
import LabeledInput from '../../components/display/shared/inputs/LabeledInput';
import LabeledSelect from '../../components/display/shared/inputs/LabeledSelect';
import Section from '../../components/display/roles/shared/Section';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
const GroupIcon = ICONS.GROUP;

interface EditGroupFormValues {
  name: string;
  description: string;
  category: string;
}

const EditGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<EditGroupFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const group = useMemo(() => {
    return STATIC_GROUPS.find((g) => g.id === id);
  }, [id]);

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        name: group.name,
        description: group.description,
        category: group.category,
      });
    }
  }, [group, form]);

  if (!group) {
    return (
      <div
        style={{
          padding: '48px 24px 24px',
          marginTop: '60px',
          background: DEFAULT_COLORS.PAGE_BG,
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <div>Group not found</div>
      </div>
    );
  }

  const handleFinish = async (values: EditGroupFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(`Group "${values.name}" updated`);
      navigate(`${APP_ROUTES.GROUPS}/${id}/view`);
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Groups', to: APP_ROUTES.GROUPS },
    { label: group.name },
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
        <Header subtitle="Edit group details" breadcrumbs={breadcrumbs} icon={<GroupIcon />} />

        <AnimatedPageWrapper>
          <div
            style={{
              ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
              padding: 16,
              width: '100%',
            }}
          >
            <Form<EditGroupFormValues>
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              initialValues={{
                name: group.name,
                description: group.description,
                category: group.category,
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
                  title={GC.LABELS.FORM.SECTION_TITLE}
                  subtitle={GC.LABELS.FORM.SECTION_SUBTITLE}
                  content={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <LabeledInput
                        name="name"
                        label={GC.LABELS.FORM.FIELDS.NAME_LABEL}
                        required
                        placeholder={GC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER}
                        marginBottom={18}
                      />
                      <LabeledInput
                        name="description"
                        label={GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
                        required
                        placeholder={GC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
                        marginBottom={18}
                      />
                      <LabeledSelect
                        name="category"
                        label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
                        placeholder={GC.LABELS.FORM.FIELDS.CATEGORY_PLACEHOLDER}
                        required
                        options={[
                          { label: 'Engineering', value: 'Engineering' },
                          { label: 'Operations', value: 'Operations' },
                          { label: 'Quality Assurance', value: 'Quality Assurance' },
                          { label: 'Security', value: 'Security' },
                          { label: 'Management', value: 'Management' },
                          { label: 'Support', value: 'Support' },
                        ]}
                        marginBottom={6}
                      />
                    </div>
                  }
                />
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                    <PrimaryButton
                      action="Update Group"
                      loading={submitting}
                      loadingLabel={BUTTON_TEXTS.LOADING}
                      onClick={() => form.submit()}
                      icon={<GroupIcon size={16} />}
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

export default EditGroup;
