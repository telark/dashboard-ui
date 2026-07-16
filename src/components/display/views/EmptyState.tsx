import React, { memo } from 'react';
import { Button, Typography, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';

const { useToken } = theme;
const { Title, Text } = Typography;

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = memo(
  ({ icon, title, description, primaryAction, secondaryAction, className }) => {
    const { token } = useToken();

    const buttonStyle: React.CSSProperties = {
      padding: '6px 16px',
      fontSize: 13,
      fontWeight: 600,
      background: DEFAULT_COLORS.SUCCESS,
      borderColor: DEFAULT_COLORS.SUCCESS,
      color: DEFAULT_COLORS.BACKGROUND_WHITE,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      boxShadow: 'none',
    };

    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          paddingLeft: token.marginLG,
          paddingRight: token.marginLG,
          textAlign: 'center',
          width: '100%',
          // No background of its own: DEFAULT_COLORS.BACKGROUND_WHITE is actually
          // dark navy, and this must read the light or dark surface it sits in.
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {icon && (
            <div
              style={{
                color: token.colorTextSecondary,
                marginBottom: token.marginLG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </div>
          )}

          <Title
            level={3}
            style={{
              color: token.colorTextHeading,
              fontWeight: 700,
              marginBottom: token.marginSM,
              marginTop: 0,
            }}
          >
            {title}
          </Title>

          <Text
            style={{
              color: token.colorTextDescription,
              maxWidth: 360,
              display: 'block',
              textAlign: 'center',
              lineHeight: 1.65,
              fontSize: 15,
              marginBottom: token.marginLG,
            }}
          >
            {description}
          </Text>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: token.marginSM,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {primaryAction && (
              <Button
                type="primary"
                icon={primaryAction.icon ?? <PlusOutlined />}
                onClick={primaryAction.onClick}
                style={buttonStyle}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button type="default" onClick={secondaryAction.onClick} style={buttonStyle}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
