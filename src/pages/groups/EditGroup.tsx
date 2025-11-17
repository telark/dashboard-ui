import React from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons, BUTTON_TEXTS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_GROUPS } from '../../data/groups';
import { GROUPS_CONSTANTS as GC } from '../../constants/pages/groups';
import LabeledInput from '../../components/display/shared/inputs/LabeledInput';
import LabeledSelect from '../../components/display/shared/inputs/LabeledSelect';
import Section from '../../components/display/roles/shared/Section';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useEditPage } from '../../hooks/layout';
import type { Group } from '../../interfaces/resources/groups';

const GroupIcon = Icons.Group;

interface EditGroupFormValues {
  name: string;
  description: string;
  category: string;
}

const EditGroup: React.FC = () => {
  const {
    item: group,
    form,
    submitting,
    handleFinish,
    notFound,
  } = useEditPage<Group, EditGroupFormValues>({
    data: STATIC_GROUPS,
    findById: (id, data) => data.find((g) => g.id === id),
    getFormValues: (item) => ({
      name: item.name,
      description: item.description,
      category: item.category,
    }),
    onUpdate: async () => {
      await new Promise((r) => setTimeout(r, 400));
    },
    successMessage: GC.LABELS.MESSAGES.UPDATED,
    viewRoute: (id) => `${APP_ROUTES.GROUPS}/${id}/view`,
  });

  if (notFound || !group) {
    return <NotFound message={GC.LABELS.NOT_FOUND} />;
  }

  const breadcrumbs = [
    { label: GC.LABELS.BREADCRUMBS.GROUPS, to: APP_ROUTES.GROUPS },
    { label: group.name },
    { label: GC.LABELS.BREADCRUMBS.EDIT },
  ];

  return (
    <PageContainer>
      <Header subtitle={GC.LABELS.EDIT_SUBTITLE} breadcrumbs={breadcrumbs} icon={<GroupIcon />} />

      <AnimatedPageWrapper>
        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<EditGroupFormValues> layout="vertical" form={form} onFinish={handleFinish}>
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
    </PageContainer>
  );
};

export default EditGroup;
