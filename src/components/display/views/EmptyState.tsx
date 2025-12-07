import React, { memo } from 'react';
import { PrimaryButton } from '../buttons';
import { BUTTON_TEXTS } from '../../../constants';

export interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onButtonClick: () => void;
  buttonLoading?: boolean;
  buttonDisabled?: boolean;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBackground?: string;
}

const EmptyState: React.FC<EmptyStateProps> = memo(
  ({
    title,
    description,
    buttonText,
    buttonIcon,
    onButtonClick,
    buttonLoading = false,
    buttonDisabled = false,
    icon,
    iconColor = '#10b981',
    iconBackground = 'rgba(16, 185, 129, 0.12)',
  }) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '48px 24px',
          textAlign: 'center',
          background: 'transparent',
          width: '100%',
        }}
      >
        {icon && (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: iconBackground,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              fontSize: 40,
              marginBottom: 24,
              boxShadow: `0 4px 12px ${iconBackground.replace('0.12', '0.2')}`,
            }}
          >
            {icon}
          </div>
        )}

        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#0B1F33',
            margin: 0,
            marginBottom: 12,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: 14,
            color: '#5B6B7C',
            margin: 0,
            marginBottom: 32,
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>

        <PrimaryButton
          action={buttonText}
          onClick={onButtonClick}
          icon={buttonIcon}
          loading={buttonLoading}
          loadingLabel={BUTTON_TEXTS.LOADING}
          disabled={buttonDisabled}
        />
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
