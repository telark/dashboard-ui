import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants';
import FormModal from '../../shared/modal/FormModal';
import { createDeviceNameValidator } from '../../../../utils/auth/passkey/validation';
import type { Passkey } from '../../../../interfaces/auth/passkeys';

const PasskeyIcon = ICONS.PASSKEY;

export interface PasskeyFormModalProps {
  open: boolean;
  isEditMode: boolean;
  selectedPasskey: Passkey | null;
  passkeys: Passkey[];
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}

const PasskeyFormModal: React.FC<PasskeyFormModalProps> = ({
  open,
  isEditMode,
  selectedPasskey,
  passkeys,
  submitting,
  onCancel,
  onSubmit,
}) => {
  return (
    <FormModal
      open={open}
      onCancel={onCancel}
      onSuccess={onSubmit}
      title={isEditMode ? PPC.FORM.EDIT_TITLE : PPC.FORM.TITLE}
      subtitle={isEditMode ? PPC.FORM.EDIT_SUBTITLE : PPC.FORM.SUBTITLE}
      sectionTitle={PPC.FORM.SECTION_TITLE}
      sectionSubtitle={PPC.FORM.SECTION_SUBTITLE}
      fields={[]}
      customContent={(form: FormInstance) => (
        <Form.Item
          name="deviceName"
          label={PPC.FORM.DEVICE_NAME_LABEL}
          rules={[
            { required: true, message: PPC.FORM.DEVICE_NAME_REQUIRED },
            {
              validator: createDeviceNameValidator(
                passkeys,
                isEditMode,
                selectedPasskey?.deviceName,
              ),
            },
          ]}
          validateTrigger="onChange"
        >
          <Input placeholder={PPC.FORM.DEVICE_NAME_PLACEHOLDER} />
        </Form.Item>
      )}
      buttonText={isEditMode ? PPC.FORM.EDIT_BUTTON_TEXT : PPC.FORM.BUTTON_TEXT}
      buttonIcon={<PasskeyIcon size={16} />}
      width={PPC.FORM.MODAL_WIDTH}
      initialValues={
        isEditMode && selectedPasskey
          ? { deviceName: selectedPasskey.deviceName }
          : PPC.FORM.INITIAL_VALUES
      }
      loading={submitting}
    />
  );
};

export default PasskeyFormModal;

