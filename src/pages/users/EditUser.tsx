import React from 'react';
import { Form } from 'antd';
import { APP_ROUTES, ICONS, BUTTON_TEXTS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_USERS } from '../../data/users';
import { USERS_CONSTANTS as UC } from '../../constants/pages/users';
import LabeledInput from '../../components/display/shared/inputs/LabeledInput';
import LabeledSelect from '../../components/display/shared/inputs/LabeledSelect';
import Section from '../../components/display/roles/shared/Section';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useEditPage } from '../../hooks/useEditPage';
import type { User } from '../../interfaces/users';

const UserIcon = ICONS.USER;

interface EditUserFormValues {
  username: string;
  fullname: string;
  email: string;
  role: string;
}

const EditUser: React.FC = () => {
  const {
    item: user,
    form,
    submitting,
    handleFinish,
    notFound,
  } = useEditPage<User, EditUserFormValues>({
    data: STATIC_USERS,
    findById: (id, data) => data.find((u) => u.id === id),
    getFormValues: (item) => ({
      username: item.username,
      fullname: item.fullname,
      email: item.email,
      role: item.role,
    }),
    onUpdate: async () => {
      await new Promise((r) => setTimeout(r, 400));
    },
    successMessage: UC.LABELS.MESSAGES.UPDATED,
    viewRoute: (id) => `${APP_ROUTES.USERS}/${id}/view`,
  });

  if (notFound || !user) {
    return <NotFound message={UC.LABELS.NOT_FOUND} />;
  }

  const breadcrumbs = [
    { label: UC.LABELS.BREADCRUMBS.USERS, to: APP_ROUTES.USERS },
    { label: user.fullname },
    { label: UC.LABELS.BREADCRUMBS.EDIT },
  ];

  return (
    <PageContainer>
      <Header subtitle={UC.LABELS.EDIT_SUBTITLE} breadcrumbs={breadcrumbs} icon={<UserIcon />} />

      <AnimatedPageWrapper>
        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<EditUserFormValues> layout="vertical" form={form} onFinish={handleFinish}>
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
                    action="Update User"
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

export default EditUser;

