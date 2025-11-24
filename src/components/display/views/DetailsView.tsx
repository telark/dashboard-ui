import React, { ReactNode } from 'react';
import { Card, Space, Tag } from 'antd';
import { COMPONENT_STYLES } from '../../../constants/layout/ui';
import { Row, Label } from '../../shared';

export interface DetailsViewField {
  key: string;
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  type?: 'text' | 'tag' | 'tags' | 'custom' | 'composed';
  tagColor?: string;
  tags?: Array<{ label: string; color?: string }>;
}

export interface DetailsViewConfig {
  fields: DetailsViewField[];
  cardStyle?: React.CSSProperties;
  headerElement?: ReactNode;
}

interface DetailsViewProps {
  config: DetailsViewConfig;
}

const DetailsView: React.FC<DetailsViewProps> = ({ config }) => {
  const renderValue = (field: DetailsViewField) => {
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
            {field.tags?.map((tag) => (
              <Tag key={tag.label} color={tag.color || 'blue'}>
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
        ...config.cardStyle,
        position: 'relative',
      }}
      styles={{ body: COMPONENT_STYLES.VIEW_DETAILS.cardBody }}
    >
      {config.headerElement && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          {config.headerElement}
        </div>
      )}
      <div style={COMPONENT_STYLES.VIEW_DETAILS.wrapper}>
        {config.fields.map((field, index) => {
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

export default DetailsView;
