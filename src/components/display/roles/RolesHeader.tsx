import React from 'react';
import { Button, Breadcrumb } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import { AiOutlineSafety } from 'react-icons/ai';
import type { RolesHeaderProps } from '../../../interfaces/roles';
import { useNavigate } from 'react-router-dom';

const RolesHeader: React.FC<RolesHeaderProps> = ({
  title,
  subtitle = 'Manage existing roles',
  onPrimary,
  primaryText,
  breadcrumbs,
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
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(32,201,151,0.12)',
            boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: DEFAULT_COLORS.SUCCESS,
            fontSize: 20,
          }}
        >
          <AiOutlineSafety />
        </div>

        <div>
          {Array.isArray(breadcrumbs) && breadcrumbs.length ? (
            <Breadcrumb
              items={breadcrumbs.map((b, idx) => ({
                title: b.to ? (
                  <span style={{ cursor: 'pointer' }} onClick={() => (b.to ? navigate(b.to) : undefined)}>
                    {b.label}
                  </span>
                ) : (
                  <span>{b.label}</span>
                ),
              }))}
              style={{ marginBottom: 0}}
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

      {primaryText ? <Button type="primary" onClick={onPrimary}>{primaryText}</Button> : <div />}
    </div>
  );
};

export default RolesHeader;


