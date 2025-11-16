import React, { useMemo } from 'react';
import { Form, Input } from 'antd';
import { ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants';
import FormModal from '../../shared/modal/FormModal';
import { createDeviceNameValidator } from '../../../../utils/auth/passkey/validation';
import type { PasskeyFormModalProps } from '../../../../interfaces/auth/passkeys';

const PasskeyIcon = ICONS.PASSKEY;

const PasskeyFormModal: React.FC<PasskeyFormModalProps> = ({
  open,
  isEditMode,
  selectedPasskey,
  passkeys,
  submitting,
  onCancel,
  onSubmit,
}) => {
  const originalDeviceName = useMemo(
    () => (isEditMode && selectedPasskey ? selectedPasskey.deviceName : undefined),
    [isEditMode, selectedPasskey],
  );

  const initialValues = useMemo(
    () =>
      isEditMode && selectedPasskey
        ? { deviceName: selectedPasskey.deviceName }
        : PPC.FORM.INITIAL_VALUES,
    [isEditMode, selectedPasskey],
  );

  const checkButtonDisabled = (form: any): boolean => {
    if (!isEditMode || !originalDeviceName) {
      return false;
    }
    const currentValue = form.getFieldValue('deviceName');
    return currentValue === originalDeviceName;
  };

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
      customContent={() => (
        <div className="form-item-compact passkey-form-modal" style={{ marginTop: -4, width: '100%', marginLeft: 0, marginRight: 0 }}>
          <Form.Item
            name="deviceName"
            label={PPC.FORM.DEVICE_NAME_LABEL}
            style={{ marginBottom: 0, marginTop: 0, width: '100%', marginLeft: 0, marginRight: 0 }}
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
            <Input placeholder={PPC.FORM.DEVICE_NAME_PLACEHOLDER} style={{ width: '100%' }} />
          </Form.Item>
        </div>
      )}
      buttonText={isEditMode ? PPC.FORM.EDIT_BUTTON_TEXT : PPC.FORM.BUTTON_TEXT}
      buttonIcon={<PasskeyIcon size={16} />}
      width={PPC.FORM.MODAL_WIDTH}
      initialValues={initialValues}
      loading={submitting}
      buttonDisabled={checkButtonDisabled}
      contentWrapperStyle={{ padding: '1px 0px 0px 0px', paddingLeft: 0, paddingRight: 0, paddingBottom: 0, margin: 0 }}
      buttonWrapperStyle={{ marginTop: 8, marginBottom: -12, width: '100%', padding: '0 0px', paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0 }}
    />
  );
};

export default PasskeyFormModal;
