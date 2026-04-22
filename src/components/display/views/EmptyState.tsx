// Used by: users, groups, roles
// Primary color and button shape mirrored from login page (see audit)
// Zero hardcoded values except where login page itself uses hardcoded values
import React, { memo } from 'react';
import { Button, Typography, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { useToken } = theme;
const { Title, Text } = Typography;

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction: {
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

    // Mirrors LoginForm.tsx passkey button exactly — CSS var with same fallback
    const buttonStyle: React.CSSProperties = {
      height: '44px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: 600,
      background: 'var(--color-primary, #1e293b)',
      borderColor: 'var(--color-primary, #1e293b)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
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
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: token.colorFillAlter,
              border: `1.5px dashed ${token.colorBorderSecondary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: token.colorTextSecondary,
              marginBottom: token.marginLG,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          <Title
            level={4}
            style={{
              color: token.colorTextHeading,
              fontWeight: 600,
              marginBottom: token.marginXS,
              marginTop: 0,
            }}
          >
            {title}
          </Title>

          <Text
            style={{
              color: token.colorTextDescription,
              maxWidth: 320,
              display: 'block',
              textAlign: 'center',
              lineHeight: 1.65,
              fontSize: 14, // mirrors login page LoginForm.tsx hardcoded value
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={primaryAction.onClick}
              style={buttonStyle}
            >
              {primaryAction.label}
            </Button>
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
