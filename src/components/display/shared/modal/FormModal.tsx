import React, { useState } from 'react';
import logger from '../../../../logging';
import { Form, message } from 'antd';
import PrimaryButton from '../../../buttons/PrimaryButton';
import { BUTTON_TEXTS } from '../../../../constants';
import BaseModal from './BaseModal';
import FormFieldRenderer from './FormFieldRenderer';
import Section from '../../roles/shared/Section';
import type { FormModalProps } from '../../../../interfaces/modal';

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
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

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
    onCancel();
  };

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
    <BaseModal open={open} onCancel={handleCancel} width={width}>
      <div
        style={{
          background: '#fff',
          padding: '24px 24px 4px 24px',
          ...contentWrapperStyle,
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
          {renderContent()}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 32,
              marginBottom: 0,
              ...buttonWrapperStyle,
            }}
          >
            <Form.Item style={{ margin: 0 }}>
              <PrimaryButton
                action={buttonText}
                loading={submitting || loading}
                loadingLabel={BUTTON_TEXTS.LOADING}
                onClick={() => form.submit()}
                icon={buttonIcon}
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </BaseModal>
  );
};

export default FormModal;
