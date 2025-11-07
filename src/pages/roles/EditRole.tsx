import React, { useMemo, useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { DEFAULT_COLORS, APP_ROUTES, BUTTON_TEXTS, ICONS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import Header from '../../components/display/shared/sections/Header';
import RolesGeneralSection from '../../components/display/roles/create/GeneralSection';
import RolesScopePermissionsSection from '../../components/display/roles/create/ScopesAndPermissionsSection';
import type { RoleScopePermission } from '../../interfaces/roles';
import { STATIC_ROLES } from '../../data/roles';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';

const RoleIcon = ICONS.ROLE;

interface EditRoleFormValues {
  name: string;
  scopes: Record<string, RoleScopePermission[]>;
}

const EditRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<EditRoleFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const role = useMemo(() => {
    return STATIC_ROLES.find((r) => r.id === id);
  }, [id]);

  useEffect(() => {
    if (role) {
      form.setFieldsValue({
        name: role.name,
        scopes: role.scopes,
      });
    }
  }, [role, form]);

  if (!role) {
    return (
      <div
        style={{
          padding: '48px 24px 24px',
          marginTop: '60px',
          background: DEFAULT_COLORS.PAGE_BG,
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <div>Role not found</div>
      </div>
    );
  }

  const handleFinish = async (values: EditRoleFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(`Role "${values.name}" updated`);
      navigate(`${APP_ROUTES.ROLES}/${id}/view`);
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Roles', to: APP_ROUTES.ROLES },
    { label: role.name },
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
          subtitle="Edit role details"
          breadcrumbs={breadcrumbs}
          icon={<RoleIcon />}
        />

        <AnimatedPageWrapper>
          <div
            style={{
              ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
              padding: 16,
              width: '100%',
            }}
          >
            <Form<EditRoleFormValues>
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              initialValues={{ name: role.name, scopes: role.scopes }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 24,
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
                    <RolesGeneralSection form={form} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <RolesScopePermissionsSection form={form} />
                  </div>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                    <PrimaryButton
                      action="Update Role"
                      loading={submitting}
                      loadingLabel={BUTTON_TEXTS.LOADING}
                      onClick={() => form.submit()}
                      icon={<RoleIcon size={16} />}
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

export default EditRole;
