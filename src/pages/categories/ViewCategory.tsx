import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import RolesHeader from '../../components/display/roles/shared/Header';
import { STATIC_CATEGORIES } from '../../data/categories';
import type { Category } from '../../interfaces/categories';
import { Card, Descriptions, Tag, Space } from 'antd';
import { AiOutlineFolderOpen } from 'react-icons/ai';

const ViewCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const category = useMemo<Category | undefined>(() => {
    return STATIC_CATEGORIES.find((c) => c.id === id);
  }, [id]);

  if (!category) {
    return (
      <div
        style={{
          padding: '48px 24px 24px',
          marginTop: '60px',
          background: DEFAULT_COLORS.PAGE_BG,
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <div>Category not found</div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Categories', to: APP_ROUTES.CATEGORIES },
    { label: category.name },
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
          subtitle="View category details"
          breadcrumbs={breadcrumbs}
          primaryText="Back to Categories"
          onPrimary={() => navigate(APP_ROUTES.CATEGORIES)}
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
                <AiOutlineFolderOpen />
                {category.name}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {category.description}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag>{category.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(category.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Used By">
              {category.usedBy && category.usedBy.length > 0 ? (
                <Space wrap>
                  {category.usedBy.map((item) => (
                    <Tag key={item} color="purple">
                      {item}
                    </Tag>
                  ))}
                </Space>
              ) : (
                <span style={{ color: '#999' }}>Not used by any roles</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};

export default ViewCategory;

