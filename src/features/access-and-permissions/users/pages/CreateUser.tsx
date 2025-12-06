import React, { useMemo } from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons, BUTTON_TEXTS } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import Header from '../../../../components/display/sections/Header';
import { USERS_CONSTANTS as UC } from '../constants';
import LabeledInput from '../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../components/display/inputs/LabeledSelect';
import LabeledAvatarPicker from '../../../../components/display/inputs/LabeledAvatarPicker';
import Section from '../../../../components/display/sections/Section';
import { PrimaryButton } from '../../../../components/display/buttons';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer } from '../../../../components/shared';
import { useUserActions } from '../hooks';
import { useRoles } from '../../roles/hooks';
import { useGroups } from '../../groups/hooks';
import type { CreateUserFormValues } from '../models';

const UserIcon = Icons.User;

const CreateUser: React.FC = () => {
  const [form] = Form.useForm<CreateUserFormValues>();
  const { handleCreate, submitting } = useUserActions();
  const { roles } = useRoles();
  const { groups } = useGroups();

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
                content={
                  <div
                    style={{
                      display: 'flex',
                      gap: 24,
                      alignItems: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
                      <LabeledAvatarPicker name="avatar" label="Avatar" />
                      <LabeledInput
                        name="username"
                        label={UC.LABELS.FORM.FIELDS.USERNAME_LABEL}
                        required
                        placeholder={UC.LABELS.FORM.FIELDS.USERNAME_PLACEHOLDER}
                      />
                      <LabeledInput
                        name="fullname"
                        label={UC.LABELS.FORM.FIELDS.FULLNAME_LABEL}
                        required
                        placeholder={UC.LABELS.FORM.FIELDS.FULLNAME_PLACEHOLDER}
                      />
                      <LabeledInput
                        name="email"
                        label={UC.LABELS.FORM.FIELDS.EMAIL_LABEL}
                        required
                        placeholder={UC.LABELS.FORM.FIELDS.EMAIL_PLACEHOLDER}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <LabeledSelect
                        name="roleID"
                        label={UC.LABELS.FORM.FIELDS.ROLE_LABEL}
                        placeholder={UC.LABELS.FORM.FIELDS.ROLE_PLACEHOLDER}
                        required
                        options={roleOptions}
                      />
                      <LabeledSelect
                        name="groupID"
                        label={UC.LABELS.FORM.FIELDS.GROUP_LABEL}
                        placeholder={UC.LABELS.FORM.FIELDS.GROUP_PLACEHOLDER}
                        required
                        options={groupOptions}
                      />
                    </div>
                  </div>
                }
              />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                  <PrimaryButton
                    action="Create User"
                    loading={submitting}
                    loadingLabel={BUTTON_TEXTS.LOADING}
                    onClick={() => form.submit()}
                    icon={<UserIcon size={16} />}
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
