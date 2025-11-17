import React, { useState, useEffect } from 'react';
import logger from '../../../../logging';
import { Form, message, Button } from 'antd';
import PrimaryButton from '../../../buttons/PrimaryButton';
import { BUTTON_TEXTS } from '../../../../constants';
import BaseModal from './BaseModal';
import FormFieldRenderer from './FormFieldRenderer';
import Section from '../../roles/shared/Section';
import type { FormModalProps } from '../../../../interfaces/layout/modal';

const FormModal: React.FC<FormModalProps> = ({
  open,
  onCancel,
  onSuccess,
  title,
  subtitle,
  sectionTitle,
  sectionSubtitle,
  fields = [],
  customContent,
  buttonText = 'Submit',
  buttonIcon,
  width = 360,
  initialValues = {},
  loading = false,
  buttonWrapperStyle,
  contentWrapperStyle,
  buttonDisabled,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const handleFinish = async (values: Record<string, any>) => {
    setSubmitting(true);
    try {
      const result = onSuccess(values);
      if (result && typeof result.then === 'function') {
        await result;
      }
      form.resetFields();
      onCancel();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      logger.error('Form submission error:', error);
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setHasValidationErrors(false);
    onCancel();
  };

  // Reset form and validation state when modal opens
  useEffect(() => {
    if (open) {
      setHasValidationErrors(false);
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [open, form, initialValues]);

  // Update form values when initialValues change (for switching between create/edit modes)
  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, open, form]);

  const renderFields = () => {
    if (fields.length === 0) return null;
    return (
      <>
        {fields.map((field) => (
          <FormFieldRenderer key={field.name} field={field} />
        ))}
      </>
    );
  };

  const renderContent = () => {
    if (customContent) {
      return typeof customContent === 'function' ? customContent(form) : customContent;
    }

    if (fields.length > 0) {
      return (
        <Section
          title={sectionTitle || title}
          subtitle={sectionSubtitle || subtitle}
          content={renderFields()}
        />
      );
    }

    return null;
  };

  return (
    <BaseModal open={open} onCancel={handleCancel} width={width} showCloseIcon={false}>
      <div
        style={{
          background: '#fff',
          padding: '24px 24px 4px 24px',
          ...contentWrapperStyle,
          paddingLeft:
            contentWrapperStyle?.paddingLeft ?? (contentWrapperStyle?.padding ? undefined : '24px'),
          paddingRight:
            contentWrapperStyle?.paddingRight ??
            (contentWrapperStyle?.padding ? undefined : '24px'),
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={initialValues}
          onValuesChange={() => {
            // Trigger validation on value change and check for errors
            form
              .validateFields()
              .then(() => {
                setHasValidationErrors(false);
              })
              .catch(() => {
                const errors = form.getFieldsError();
                setHasValidationErrors(errors.some((field) => field.errors.length > 0));
              });
          }}
        >
          {renderContent()}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 32,
              marginBottom: 0,
              gap: 8,
              ...buttonWrapperStyle,
            }}
          >
            <Form.Item
              style={{ margin: 0, width: buttonWrapperStyle?.width === '100%' ? '100%' : 'auto' }}
              shouldUpdate={() => {
                // Force re-render when values change to update button disabled state
                return typeof buttonDisabled === 'function';
              }}
            >
              {() => (
                <PrimaryButton
                  action={buttonText}
                  loading={submitting || loading}
                  loadingLabel={BUTTON_TEXTS.LOADING}
                  onClick={() => form.submit()}
                  icon={buttonIcon}
                  disabled={
                    hasValidationErrors ||
                    (typeof buttonDisabled === 'function'
                      ? buttonDisabled(form)
                      : buttonDisabled === true)
                  }
                  style={buttonWrapperStyle?.width === '100%' ? { width: '100%' } : undefined}
                />
              )}
            </Form.Item>
            <Button
              type="text"
              onClick={handleCancel}
              style={{
                width: buttonWrapperStyle?.width === '100%' ? '100%' : 'auto',
                color: '#64748b',
                padding: '4px 8px',
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </BaseModal>
  );
};

export default FormModal;
