import React, { memo } from 'react';
import { Button, Form } from 'antd';
import type { FormInstance } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../constants/shared/pages';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';

const { GAP_BETWEEN_CARDS } = PPC.CREATE_PAGE;

export interface CreatePlanBreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface CreatePlanLayoutProps {
  breadcrumbItems: CreatePlanBreadcrumbItem[];
  subtitle: string;
  children: React.ReactNode;
  submitLabel: string;
  onSubmit: () => void;
  submitting?: boolean;
  form?: FormInstance;
}

const BREADCRUMB_LINK_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: '#64748b',
  fontSize: 28,
  fontWeight: 700,
  fontFamily: 'inherit',
  textDecoration: 'none',
};

const CreatePlanLayout: React.FC<CreatePlanLayoutProps> = memo(
  ({ breadcrumbItems, subtitle, children, submitLabel, onSubmit, submitting, form }) => {
    const titleContent = (
      <>
        {breadcrumbItems.map((b, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span style={{ color: '#64748b' }}> / </span>}
            {b.onClick ? (
              <button type="button" onClick={b.onClick} style={BREADCRUMB_LINK_STYLE}>
                {b.label}
              </button>
            ) : (
              <span style={{ color: '#0B1F33' }}>{b.label}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );

    return (
      <div
        style={{
          minHeight: '100vh',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          padding: PAGE_CONTENT_LAYOUT.PADDING,
          marginTop: 0,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#0B1F33',
                margin: 0,
                padding: 0,
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {titleContent}
            </h1>
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#64748b',
                margin: 0,
                marginTop: 0,
                padding: 0,
                lineHeight: 1.2,
                fontFamily: "'Roboto Condensed', sans-serif",
              }}
            >
              {subtitle}
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: GAP_BETWEEN_CARDS,
                marginTop: 24,
              }}
            >
              {children}
            </div>

            <div style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {submitLabel}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  },
);

CreatePlanLayout.displayName = 'CreatePlanLayout';

export default CreatePlanLayout;
