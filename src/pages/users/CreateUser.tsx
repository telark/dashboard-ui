import React, { useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS, BUTTON_TEXTS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import { USERS_CONSTANTS as UC } from '../../constants/pages/users';
import LabeledInput from '../../components/display/shared/inputs/LabeledInput';
import LabeledSelect from '../../components/display/shared/inputs/LabeledSelect';
import LabeledAvatarPicker from '../../components/display/shared/inputs/LabeledAvatarPicker';
import Section from '../../components/display/roles/shared/Section';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer } from '../../components/shared';
import { useDispatch } from 'react-redux';
import { addUser } from '../../store/users/slices/userSlice';
import type { User } from '../../interfaces/users';

const UserIcon = ICONS.USER;

interface CreateUserFormValues {
  username: string;
  fullname: string;
  email: string;
  role: string;
  avatar?: { style: string; seed: string };
}

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm<CreateUserFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: CreateUserFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const newUser: User = {
        id: `usr-${Date.now()}`,
        username: values.username,
        fullname: values.fullname,
        email: values.email,
        role: values.role,
        creationDate: new Date().toISOString(),
        avatar: values.avatar,
      };
      dispatch(addUser(newUser));
      message.success(UC.LABELS.MESSAGES.CREATED(values.fullname));
      navigate(`${APP_ROUTES.USERS}/${newUser.id}/view`);
    } finally {
      setSubmitting(false);
    }
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
              role: 'Viewer',
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
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <LabeledSelect
                      name="role"
                      label={UC.LABELS.FORM.FIELDS.ROLE_LABEL}
                      placeholder={UC.LABELS.FORM.FIELDS.ROLE_PLACEHOLDER}
                      required
                      options={[
                        { label: 'Admin', value: 'Admin' },
                        { label: 'Viewer', value: 'Viewer' },
                        { label: 'Contributor', value: 'Contributor' },
                        { label: 'Ops Engineer', value: 'Ops Engineer' },
                        { label: 'Platform Admin', value: 'Platform Admin' },
                      ]}
                    />
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
