import React, { useEffect } from 'react';
import { Form } from 'antd';
import { PrimaryButton } from '../buttons';
import Section from '../sections/Section';
import SlideOutPanel from './SlideOutPanel';
import type { SlideOutPanelProps } from './SlideOutPanel';
import { BUTTON_TEXTS } from '../../../constants';

export interface CreatePanelProps extends Omit<SlideOutPanelProps, 'children'> {
  sectionTitle?: string;
  sectionSubtitle?: string;
  formContent: React.ReactNode;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onCancel: () => void;
  submitButtonText: string;
  submitButtonIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  initialValues?: Record<string, unknown>;
  cancelButtonText?: string;
  onValuesChange?: (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>,
  ) => void;
  onFieldsChange?: (changedFields: unknown[], allFields: unknown[]) => void;
}

const CreatePanel: React.FC<CreatePanelProps> = ({
  open,
  onClose,
  title,
  subtitle,
  sectionTitle,
  sectionSubtitle,
  formContent,
  onSubmit,
  onCancel,
  submitButtonText,
  submitButtonIcon,
  loading = false,
  disabled = false,
  initialValues = {},
  cancelButtonText = 'Cancel',
  width = 480,
  onValuesChange,
  onFieldsChange,
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: Record<string, unknown>) => {
    try {
      await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      // Error handling is done in the onSubmit function
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
    onClose();
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [open, form, initialValues]);

  return (
    <SlideOutPanel open={open} onClose={onClose} title={title} subtitle={subtitle} width={width}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        onValuesChange={onValuesChange}
        onFieldsChange={onFieldsChange}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {sectionTitle ? (
            <Section title={sectionTitle} subtitle={sectionSubtitle} content={formContent} />
          ) : (
            formContent
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            paddingTop: 24,
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 'auto',
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            {cancelButtonText}
          </button>
          <PrimaryButton
            action={submitButtonText}
            loading={loading}
            loadingLabel={BUTTON_TEXTS.LOADING}
            onClick={() => form.submit()}
            icon={submitButtonIcon}
            disabled={disabled || loading}
          />
        </div>
      </Form>
    </SlideOutPanel>
  );
};

export default CreatePanel;
