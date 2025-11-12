import React, { useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS, BUTTON_TEXTS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import { GROUPS_CONSTANTS as GC } from '../../constants/pages/groups';
import LabeledInput from '../../components/display/shared/inputs/LabeledInput';
import LabeledSelect from '../../components/display/shared/inputs/LabeledSelect';
import Section from '../../components/display/roles/shared/Section';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer } from '../../components/shared';
import { useDispatch } from 'react-redux';
import { addGroup } from '../../store/groups/slices/groupSlice';
import type { Group } from '../../interfaces/groups';

const GroupIcon = ICONS.GROUP;

interface CreateGroupFormValues {
  name: string;
  description: string;
  category: string;
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm<CreateGroupFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: CreateGroupFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const newGroup: Group = {
        id: `grp-${Date.now()}`,
        name: values.name,
        description: values.description,
        category: values.category,
        createdAt: new Date().toISOString(),
      };
      dispatch(addGroup(newGroup));
      message.success(GC.LABELS.MESSAGES.CREATED(values.name));
      navigate(`${APP_ROUTES.GROUPS}/${newGroup.id}/view`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header
        subtitle={GC.LABELS.CREATE_SUBTITLE}
        breadcrumbs={[
          { label: GC.LABELS.BREADCRUMBS.GROUPS, to: APP_ROUTES.GROUPS },
          { label: GC.LABELS.BREADCRUMBS.CREATE },
        ]}
        icon={<GroupIcon />}
      />

      <AnimatedPageWrapper>
        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<CreateGroupFormValues>
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            initialValues={{
              name: '',
              description: '',
              category: 'Engineering',
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
                    action="Create Group"
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
    </PageContainer>
  );
};

export default CreateGroup;
