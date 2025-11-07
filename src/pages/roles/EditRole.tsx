import React, { useMemo, useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import RoleForm, { type RoleFormValues } from '../../components/display/roles/shared/RoleForm';
import { STATIC_ROLES } from '../../data/roles';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';

const RoleIcon = ICONS.ROLE;

const EditRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<RoleFormValues>();
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

  const handleFinish = async (values: RoleFormValues) => {
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
        <Header subtitle="Edit role details" breadcrumbs={breadcrumbs} icon={<RoleIcon />} />

        <RoleForm
          form={form}
          initialValues={{ name: role.name, scopes: role.scopes }}
          onSubmit={handleFinish}
          buttonText="Update Role"
          submitting={submitting}
          wrapper={AnimatedPageWrapper}
        />
      </div>
    </div>
  );
};

export default EditRole;
