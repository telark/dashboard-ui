import React, { useState } from 'react';
import { Modal, Form, message } from 'antd';
import { AiOutlineFolderOpen, AiOutlineClose } from 'react-icons/ai';
import PrimaryButton from '../../../buttons/PrimaryButton';
import { BUTTON_TEXTS } from '../../../../constants';
import LabeledInput from '../../../shared/LabeledInput';
import LabeledSelect from '../../../shared/LabeledSelect';
import Section from '../shared/Section';

interface CreateCategoryModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (category: { name: string; description: string; type: string }) => void;
}

const CATEGORY_TYPE_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'System', value: 'system' },
  { label: 'Custom', value: 'custom' },
];

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: { name: string; description: string; type: string }) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(`Category "${values.name}" created`);
      form.resetFields();
      onSuccess(values);
      onCancel();
    } catch (error) {
      message.error('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={360}
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
          initialValues={{ type: 'default' }}
        >
              <Section
                title="Category Details"
                subtitle="Provide the category information."
                content={
                  <>
                    <LabeledInput
                      name="name"
                      label="Category Name"
                      required
                      placeholder="e.g. General"
                      marginBottom={18}
                    />
                    <LabeledInput
                      name="description"
                      label="Category Description"
                      required
                      placeholder="e.g. Common roles for everyday access"
                      marginBottom={18}
                    />
                    <LabeledSelect
                      name="type"
                      label="Category Type"
                      required
                      options={CATEGORY_TYPE_OPTIONS}
                      placeholder="Select a type"
                      marginBottom={6}
                    />
                  </>
                }
              />

           <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 0 }}>
             <Form.Item style={{ margin: 0 }}>
               <PrimaryButton
                 action="Create Category"
                 loading={submitting}
                 loadingLabel={BUTTON_TEXTS.LOADING}
                 onClick={() => form.submit()}
                 icon={<AiOutlineFolderOpen size={16} />}
               />
             </Form.Item>
           </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateCategoryModal;

