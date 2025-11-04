import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import RolesHeader from '../../components/display/roles/shared/Header';
import { STATIC_ROLES } from '../../data/roles';
import type { Role } from '../../interfaces/roles';
import { Card, Descriptions, Tag, Space } from 'antd';
import { AiOutlineSafety } from 'react-icons/ai';

const ViewRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const role = useMemo<Role | undefined>(() => {
    return STATIC_ROLES.find((r) => r.id === id);
  }, [id]);

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

  const breadcrumbs = [
    { label: 'Roles', to: APP_ROUTES.ROLES },
    { label: role.name },
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
        <RolesHeader
          subtitle="View role details"
          breadcrumbs={breadcrumbs}
          primaryText="Back to Roles"
          onPrimary={() => navigate(APP_ROUTES.ROLES)}
        />

        <Card
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
          }}
        >
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Name">
              <Space>
                <AiOutlineSafety />
                {role.name}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={role.status === 'Active' ? 'green' : 'default'}>
                {role.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag>{role.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(role.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Scopes & Permissions">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Object.entries(role.scopes).map(([area, permissions]) => (
                  <div key={area}>
                    <div style={{ fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>
                      {area}
                    </div>
                    <Space wrap>
                      {permissions.map((permission) => (
                        <Tag key={permission} color="blue">
                          {permission}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default ViewRole;

