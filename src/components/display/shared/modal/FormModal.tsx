import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import PrimaryButton from '../../../buttons/PrimaryButton';
import { BUTTON_TEXTS } from '../../../../constants';
import LabeledInput from '../../../shared/LabeledInput';
import LabeledSelect from '../../../shared/LabeledSelect';
import Section from '../../roles/shared/Section';

export interface FormFieldConfig {
  type: 'input' | 'select' | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  marginBottom?: number;
  rules?: any[];
}

export interface FormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (values: Record<string, any>) => void | Promise<void>;
  title: string;
  subtitle?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  fields?: FormFieldConfig[];
  customContent?: React.ReactNode | ((form: any) => React.ReactNode);
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  width?: number;
  initialValues?: Record<string, any>;
  loading?: boolean;
}

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
      message.error('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      required: field.required,
      marginBottom: field.marginBottom ?? 18,
      rules: field.rules,
    };

    switch (field.type) {
      case 'input':
        return (
          <LabeledInput
            {...commonProps}
            placeholder={field.placeholder}
          />
        );
      case 'select':
        return (
          <LabeledSelect
            {...commonProps}
            placeholder={field.placeholder}
            options={field.options || []}
          />
        );
      case 'textarea':
        return (
          <Form.Item
            label={field.label}
            name={field.name}
            rules={field.required ? [{ required: true, message: `Please enter ${field.label.toLowerCase()}` }, ...(field.rules || [])] : field.rules}
            style={{ marginBottom: field.marginBottom ?? 18 }}
            className="form-item-compact"
          >
            <Input.TextArea
              placeholder={field.placeholder}
              rows={3}
              allowClear
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={width}
      centered
      styles={{
        body: { padding: 0, minHeight: 320 },
        content: { borderRadius: 16, overflow: 'hidden' },
      }}
      closeIcon={
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 20px' }}>
          <AiOutlineClose size={18} color="#000" />
        </span>
      }
    >
      <div
        style={{
          background: '#fff',
          padding: '24px 24px 4px 24px',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={initialValues}
        >
          {customContent ? (
            typeof customContent === 'function' ? customContent(form) : customContent
          ) : (
            <Section
              title={sectionTitle || title}
              subtitle={sectionSubtitle || subtitle}
              content={
                <>
                  {fields.map((field) => (
                    <React.Fragment key={field.name}>
                      {renderField(field)}
                    </React.Fragment>
                  ))}
                </>
              }
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 0 }}>
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
    </Modal>
  );
};

export default FormModal;

