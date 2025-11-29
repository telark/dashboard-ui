import React from 'react';
import { Form } from 'antd';
import { Icons, BUTTON_TEXTS } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import Header from '../../../../components/display/sections/Header';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { APP_ROUTES } from '../../../../constants';
import Section from '../../../../components/display/sections/Section';
import { PrimaryButton } from '../../../../components/display/buttons';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer } from '../../../../components/shared';
import {
  useGroupActions,
  useGroups,
  useGroupNameValidation,
  useGroupCategories,
  useGroupFormState,
} from '../hooks';
import GroupFormFields from '../components/display/shared/GroupFormFields';
import type { GroupFormData } from '../models';

const GroupIcon = Icons.Group;

const CreateGroup: React.FC = () => {
  const [form] = Form.useForm<GroupFormData>();
  const { handleCreate, submitting } = useGroupActions();
  const { groups } = useGroups();
  const { categoryOptions, defaultCategoryId } = useGroupCategories();

  const { nameValidator, normalizeName } = useGroupNameValidation({
    groups,
    isEditMode: false,
  });

  const { handleValuesChange, handleFieldsChange, hasFormErrors } = useGroupFormState({
    form,
    isEditMode: false,
  });

  const handleFinish = async (values: GroupFormData) => {
    await handleCreate(values);
  };

  const isButtonDisabled = submitting || hasFormErrors;

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
          <Form<GroupFormData>
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            initialValues={{
              name: '',
              description: '',
              categoryID: defaultCategoryId,
            }}
            onValuesChange={handleValuesChange}
            onFieldsChange={handleFieldsChange}
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
                  <GroupFormFields
                    nameValidator={nameValidator}
                    normalizeName={normalizeName}
                    categoryOptions={categoryOptions}
                  />
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
                    disabled={isButtonDisabled}
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
