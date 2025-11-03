import React, { useMemo, useState } from 'react';
import { Form, message } from 'antd';
import { AiOutlineSafety } from 'react-icons/ai';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { DEFAULT_COLORS, APP_ROUTES, BUTTON_TEXTS } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/ui';
import RolesHeader from '../../components/display/roles/shared/Header';
import { useNavigate } from 'react-router-dom';
import RolesGeneralSection from '../../components/display/roles/create/GeneralSection';
import RolesScopePermissionsSection from '../../components/display/roles/create/ScopesAndPermissionsSection';
import GroupAssignmentSection from '../../components/display/roles/create/GroupAssignmentSection';

type RoleScopeLevel = 'View' | 'Edit' | 'Delete';

interface CreateRoleFormValues {
  name: string;
  category: string;
  group: string;
  scopes: Record<string, RoleScopeLevel[]>; // area -> levels
}

const CreateRole: React.FC = () => {
  const [form] = Form.useForm<CreateRoleFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const initialScopes = useMemo(() => ({} as Record<string, RoleScopeLevel[]>), []);

  const handleFinish = async (values: CreateRoleFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(`Role "${values.name}" created`);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();

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
        <RolesHeader
          subtitle="Create a new role"
          breadcrumbs={[{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: 'Create Role' }]}
        />

        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<CreateRoleFormValues>
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            initialValues={{ category: 'general', group: 'default', scopes: initialScopes }}
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
                  <GroupAssignmentSection form={form} />
                </div>
                <div style={{ flex: 1 }}>
                  <RolesScopePermissionsSection form={form} />
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                  <PrimaryButton
                    action="Create Role"
                    loading={submitting}
                    loadingLabel={BUTTON_TEXTS.LOADING}
                    onClick={() => form.submit()}
                    icon={<AiOutlineSafety size={16} />}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;


