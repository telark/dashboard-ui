import React, { useState, useEffect } from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import PrimaryButton from '../../../buttons/PrimaryButton';
import { BUTTON_TEXTS, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import LabeledInput from '../../shared/inputs/LabeledInput';
import type { Passkey } from '../../../../interfaces/auth/passkeys';

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
  existingPasskeys?: Passkey[];
  isEditMode?: boolean;
}

const PasskeyForm: React.FC<PasskeyFormProps> = ({
  form,
  initialValues,
  onSubmit,
  buttonText,
  submitting = false,
  wrapper: Wrapper,
  existingPasskeys = [],
  isEditMode = false,
}) => {
  const [deviceName, setDeviceName] = useState<string>('');
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  useEffect(() => {
    const subscription = form.getFieldValue('deviceName');
    if (subscription !== undefined) {
      setDeviceName(subscription);
    }
  }, [form]);

  useEffect(() => {
    const checkDuplicate = () => {
      if (!deviceName || deviceName.trim() === '') {
        setIsDuplicate(false);
        return;
      }

      const trimmedName = deviceName.trim();
      const exists = existingPasskeys.some((passkey) => {
        // In edit mode, exclude the current passkey from the check
        if (isEditMode && initialValues.deviceName === passkey.deviceName) {
          return false;
        }
        return passkey.deviceName?.toLowerCase() === trimmedName.toLowerCase();
      });

      setIsDuplicate(exists);
      // Trigger validation
      form.validateFields(['deviceName']).catch(() => {
        // Ignore validation errors, we're just triggering the check
      });
    };

    checkDuplicate();
  }, [deviceName, existingPasskeys, isEditMode, initialValues.deviceName, form]);

  const validateDeviceName = (_: unknown, value: string) => {
    if (!value || value.trim() === '') {
      return Promise.resolve();
    }

    const trimmedName = value.trim();
    const exists = existingPasskeys.some((passkey) => {
      if (isEditMode && initialValues.deviceName === passkey.deviceName) {
        return false;
      }
      return passkey.deviceName?.toLowerCase() === trimmedName.toLowerCase();
    });

    if (exists) {
      return Promise.reject(new Error(PPC.FORM.DEVICE_NAME_DUPLICATE));
    }

    return Promise.resolve();
  };

  const formContent = (
    <div
      style={{
        ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
        padding: PPC.FORM.STYLES.CARD_PADDING,
        width: PPC.FORM.STYLES.FULL_WIDTH,
      }}
    >
      <Form<PasskeyFormValues>
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        initialValues={initialValues}
        onValuesChange={(changedValues) => {
          if (changedValues.deviceName !== undefined) {
            setDeviceName(changedValues.deviceName);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: PPC.FORM.STYLES.FORM_GAP,
            width: PPC.FORM.STYLES.FULL_WIDTH,
          }}
        >
          <Form.Item
            name="deviceName"
            label={PPC.FORM.DEVICE_NAME_LABEL}
            rules={[
              { required: true, message: PPC.FORM.DEVICE_NAME_REQUIRED },
              { validator: validateDeviceName },
            ]}
            validateTrigger="onChange"
          >
            <Input placeholder={PPC.FORM.DEVICE_NAME_PLACEHOLDER} />
          </Form.Item>
          <div
            style={{ width: PPC.FORM.STYLES.FULL_WIDTH, display: 'flex', justifyContent: 'center' }}
          >
            <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
              <PrimaryButton
                action={buttonText}
                loading={submitting}
                loadingLabel={BUTTON_TEXTS.LOADING}
                onClick={() => form.submit()}
                icon={<PasskeyIcon size={16} />}
                disabled={isDuplicate}
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
