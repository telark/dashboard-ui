import React from 'react';
import { Breadcrumb } from 'antd';
import { DEFAULT_COLORS, BUTTON_TEXTS } from '../../../constants';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../buttons/PrimaryButton';
import type { HeaderProps } from '../../../interfaces/layout/sections';

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onPrimary,
  primaryText,
  primaryIcon,
  primaryLoading = false,
  primaryDisabled = false,
  onSecondary,
  secondaryText,
  secondaryIcon,
  icon,
  iconColor = DEFAULT_COLORS.SUCCESS,
  iconBackground = 'rgba(32,201,151,0.12)',
  breadcrumbs,
  extraContent,
}) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {icon && (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: iconBackground,
                boxShadow: `inset 0 0 0 2px ${iconBackground.replace('0.12', '0.18').replace('0.05', '0.08')}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconColor,
                fontSize: 20,
              }}
            >
              {icon}
            </div>
          )}

          <div>
            {Array.isArray(breadcrumbs) && breadcrumbs.length ? (
              <Breadcrumb
                items={breadcrumbs.map((b: { label: string; to?: string }) => ({
                  title: b.to ? (
                    <button
                      type="button"
                      onClick={() => (b.to ? navigate(b.to) : undefined)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: 'inherit',
                        font: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span>{b.label}</span>
                  ),
                }))}
                style={{ marginBottom: 0 }}
              />
            ) : null}
            {title ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0B1F33' }}>{title}</div>
              </div>
            ) : null}
            {subtitle ? (
              <div style={{ color: '#5B6B7C', fontSize: 12, marginTop: 2 }}>{subtitle}</div>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {secondaryText ? (
            <PrimaryButton
              action={secondaryText}
              onClick={onSecondary || (() => {})}
              icon={secondaryIcon}
              loading={false}
              loadingLabel={BUTTON_TEXTS.LOADING}
            />
          ) : null}
          {primaryText ? (
            <PrimaryButton
              action={primaryText}
              onClick={onPrimary || (() => {})}
              icon={primaryIcon || <AiOutlinePlus size={16} />}
              loading={primaryLoading}
              loadingLabel={BUTTON_TEXTS.LOADING}
              disabled={primaryDisabled}
            />
          ) : null}
        </div>
      </div>

      {extraContent ? (
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          {extraContent}
        </div>
      ) : null}
    </div>
  );
};

export default Header;
