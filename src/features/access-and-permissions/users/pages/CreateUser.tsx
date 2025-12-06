import React, { useMemo, useState, useCallback } from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons, BUTTON_TEXTS } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import Header from '../../../../components/display/sections/Header';
import { USERS_CONSTANTS as UC } from '../constants';
import Section from '../../../../components/display/sections/Section';
import { PrimaryButton } from '../../../../components/display/buttons';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer } from '../../../../components/shared';
import { useUserActions } from '../hooks';
import { useRoles } from '../../roles/hooks';
import { useGroups } from '../../groups/hooks';
import UserFormFields from '../components/display/shared/UserFormFields';
import type { CreateUserFormValues } from '../models';

const UserIcon = Icons.User;

const CreateUser: React.FC = () => {
  const [form] = Form.useForm<CreateUserFormValues>();
  const { handleCreate, submitting } = useUserActions();
  const { roles } = useRoles();
  const { groups } = useGroups();
  const [hasFormErrors, setHasFormErrors] = useState(false);

  const checkFormState = useCallback(() => {
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field) => field.errors.length > 0);
    setHasFormErrors(hasErrors);
  }, [form]);

  const handleValuesChange = useCallback(() => {
    checkFormState();
  }, [checkFormState]);

  const handleFieldsChange = useCallback(() => {
    checkFormState();
  }, [checkFormState]);

  const roleOptions = useMemo(() => {
    return roles.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  }, [roles]);

  const groupOptions = useMemo(() => {
    return groups.map((group) => ({
      label: group.name,
      value: group.id,
    }));
  }, [groups]);

  const handleFinish = async (values: CreateUserFormValues) => {
    const userData: CreateUserFormValues = {
      username: values.username,
      fullname: values.fullname,
      email: values.email,
      roleID: values.roleID,
      groupID: values.groupID || '',
      avatar: values.avatar,
    };
    await handleCreate(userData);
    form.resetFields();
  };

  return (
    <PageContainer>
      <Header
        subtitle={UC.LABELS.CREATE_SUBTITLE}
        breadcrumbs={[
          { label: UC.LABELS.BREADCRUMBS.USERS, to: APP_ROUTES.USERS },
          { label: UC.LABELS.BREADCRUMBS.CREATE },
        ]}
        icon={<UserIcon />}
      />

      <AnimatedPageWrapper>
        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<CreateUserFormValues>
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            onValuesChange={handleValuesChange}
            onFieldsChange={handleFieldsChange}
            initialValues={{
              username: '',
              fullname: '',
              email: '',
              roleID: '',
              groupID: '',
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
                title={UC.LABELS.FORM.SECTION_TITLE}
                subtitle={UC.LABELS.FORM.SECTION_SUBTITLE}
                content={<UserFormFields roleOptions={roleOptions} groupOptions={groupOptions} />}
              />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                  <PrimaryButton
                    action="Create User"
                    loading={submitting}
                    loadingLabel={BUTTON_TEXTS.LOADING}
                    onClick={() => form.submit()}
                    icon={<UserIcon size={16} />}
                    disabled={submitting || hasFormErrors}
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

export default CreateUser;
