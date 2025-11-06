import React from 'react';
import { Card, Space, Tag } from 'antd';
import { ReactNode } from 'react';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import { Row, Label } from '../../../../components/shared';

export interface ViewDetailField {
  key: string;
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  type?: 'text' | 'tag' | 'tags' | 'custom' | 'composed';
  tagColor?: string;
  tags?: Array<{ label: string; color?: string }>;
}

export interface ViewDetailsConfig {
  fields: ViewDetailField[];
  cardStyle?: React.CSSProperties;
}

interface ViewDetailsProps {
  config: ViewDetailsConfig;
}

const ViewDetails: React.FC<ViewDetailsProps> = ({ config }) => {
  const renderValue = (field: ViewDetailField) => {
    switch (field.type) {
      case 'tag':
        return (
          <Tag color={field.tagColor || 'blue'} style={{ margin: 0 }}>
            {field.value}
          </Tag>
        );
      case 'tags':
        return (
          <Space wrap>
            {field.tags?.map((tag, idx) => (
              <Tag key={idx} color={tag.color || 'blue'}>
                {tag.label}
              </Tag>
            ))}
          </Space>
        );
      case 'custom':
        return field.value;
      default:
        return <span style={{ fontWeight: 700 }}>{field.value}</span>;
    }
  };

  return (
    <Card
      style={{
        ...COMPONENT_STYLES.VIEW_DETAILS.card,
        ...(config.cardStyle || {}),
      }}
      styles={{ body: COMPONENT_STYLES.VIEW_DETAILS.cardBody }}
    >
      <div style={COMPONENT_STYLES.VIEW_DETAILS.wrapper}>
        {config.fields.map((field, index) => {
          // Handle composed fields (like Scopes & Permissions) differently
          if (field.type === 'composed') {
            const hasMoreFields = index < config.fields.length - 1;

            return (
              <div key={field.key}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 0',
                    marginBottom: 12,
                  }}
                >
                  {field.icon ? (
                    <Label icon={field.icon} text={field.label} />
                  ) : (
                    <span
                      style={{
                        color: '#6b7280',
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                      }}
                    >
                      {field.label}
                    </span>
                  )}
                </div>
                <div style={{ paddingLeft: field.icon ? 24 : 0 }}>{field.value}</div>
                {hasMoreFields && (
                  <div
                    style={{
                      borderBottom: '1px solid #eef2f6',
                      marginTop: 12,
                      marginBottom: 12,
                    }}
                  />
                )}
              </div>
            );
          }

          // Regular fields
          return (
            <Row
              key={field.key}
              left={
                field.icon ? (
                  <Label icon={field.icon} text={field.label} />
                ) : (
                  <span
                    style={{
                      color: '#6b7280',
                      fontWeight: 700,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                    }}
                  >
                    {field.label}
                  </span>
                )
              }
              right={renderValue(field)}
              withDivider={index < config.fields.length - 1}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default ViewDetails;
