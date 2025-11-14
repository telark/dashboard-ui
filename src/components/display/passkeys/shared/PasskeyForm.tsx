import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import PrimaryButton from '../../../buttons/PrimaryButton';
import { BUTTON_TEXTS, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import LabeledInput from '../../shared/inputs/LabeledInput';

const PasskeyIcon = ICONS.PASSKEY;

export interface PasskeyFormValues {
  deviceName: string;
}

interface PasskeyFormProps {
  form: FormInstance<PasskeyFormValues>;
  initialValues: PasskeyFormValues;
  onSubmit: (values: PasskeyFormValues) => void;
  buttonText: string;
  submitting?: boolean;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

const PasskeyForm: React.FC<PasskeyFormProps> = ({
  form,
  initialValues,
  onSubmit,
  buttonText,
  submitting = false,
  wrapper: Wrapper,
}) => {
  const formContent = (
    <div
      style={{
        ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
        padding: 16,
        width: '100%',
      }}
    >
      <Form<PasskeyFormValues>
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        initialValues={initialValues}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            width: '100%',
          }}
        >
          <LabeledInput
            name="deviceName"
            label={PPC.FORM.DEVICE_NAME_LABEL}
            placeholder={PPC.FORM.DEVICE_NAME_PLACEHOLDER}
            rules={[{ required: true, message: PPC.FORM.DEVICE_NAME_REQUIRED }]}
            component={Input}
          />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
              <PrimaryButton
                action={buttonText}
                loading={submitting}
                loadingLabel={BUTTON_TEXTS.LOADING}
                onClick={() => form.submit()}
                icon={<PasskeyIcon size={16} />}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );

  return Wrapper ? <Wrapper>{formContent}</Wrapper> : formContent;
};

export default PasskeyForm;
