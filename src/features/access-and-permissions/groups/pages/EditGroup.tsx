import React, { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons, BUTTON_TEXTS } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import Header from '../../../../components/display/sections/Header';
import { GROUPS_CONSTANTS as GC } from '../constants';
import LabeledInput from '../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../components/display/inputs/LabeledSelect';
import Section from '../../../../components/display/sections/Section';
import { PrimaryButton } from '../../../../components/display/buttons';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { useGroupDetails, useGroupActions } from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import type { GroupFormData } from '../models';
import { mapCategoriesToOptions } from '../../categories/utils';

const GroupIcon = Icons.Group;

const EditGroup: React.FC = () => {
  const { id, group, loading, notFound } = useGroupDetails();
  const { handleUpdate, submitting } = useGroupActions();
  const [form] = Form.useForm<GroupFormData>();
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);

  const categoryOptions = useMemo(() => mapCategoriesToOptions(categories), [categories]);

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        name: group.name,
        description: group.description,
        categoryID: group.categoryID,
      });
    }
  }, [group, form]);

  const handleFinish = async (values: GroupFormData) => {
    if (!id) return;
    await handleUpdate(id, values);
  };

  if (loading) {
    return (
      <PageContainer>
        <Header subtitle={GC.LABELS.EDIT_SUBTITLE} breadcrumbs={[]} icon={<GroupIcon />} />
        <div>Loading...</div>
      </PageContainer>
    );
  }

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
          <Form<GroupFormData> layout="vertical" form={form} onFinish={handleFinish}>
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
                      name="categoryID"
                      label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
                      placeholder={GC.LABELS.FORM.FIELDS.CATEGORY_PLACEHOLDER}
                      required
                      options={categoryOptions}
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
