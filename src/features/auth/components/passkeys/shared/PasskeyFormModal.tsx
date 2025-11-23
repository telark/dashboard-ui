import React, { useMemo, useRef } from 'react';
import { Form, Input } from 'antd';
import { Icons } from '../../../../../constants';
import { PASSKEYS_CONSTANTS as PPC } from '../../../constants/passkeys';
import FormModal from '../../../../../components/display/shared/modal/FormModal';
import { createDeviceNameValidator } from '../../../utils';
import type { PasskeyFormModalProps } from '../../../models/passkeys';
import DeviceNameSuggestions from './DeviceNameSuggestions';

const PasskeyIcon = Icons.Passkey;

interface PasskeyFormContentProps {
  form: any;
  passkeys: PasskeyFormModalProps['passkeys'];
  isEditMode: boolean;
  selectedPasskey: PasskeyFormModalProps['selectedPasskey'];
}

const PasskeyFormContent: React.FC<PasskeyFormContentProps> = ({
  form,
  passkeys,
  isEditMode,
  selectedPasskey,
}) => {
  const inputRef = useRef<any>(null);

  const handleSuggestionSelect = (suggestion: string) => {
    form.setFieldValue('deviceName', suggestion);
    if (inputRef.current) {
      const input = inputRef.current.input || inputRef.current;
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set;
        nativeInputValueSetter?.call(input, suggestion);
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
    form.validateFields(['deviceName']);
  };

  return (
    <div
      className="form-item-compact passkey-form-modal"
      style={{ marginTop: -4, width: '100%', marginLeft: 0, marginRight: 0 }}
    >
      <Form.Item
        name="deviceName"
        label={PPC.FORM.DEVICE_NAME_LABEL}
        style={{ marginBottom: 0, marginTop: 0, width: '100%', marginLeft: 0, marginRight: 0 }}
        rules={[
          { required: true, message: PPC.FORM.DEVICE_NAME_REQUIRED },
          {
            validator: createDeviceNameValidator(passkeys, isEditMode, selectedPasskey?.deviceName),
          },
        ]}
        validateTrigger="onChange"
      >
        <Input
          ref={inputRef}
          placeholder={PPC.FORM.DEVICE_NAME_PLACEHOLDER}
          style={{ width: '100%' }}
        />
      </Form.Item>
      {!isEditMode && (
        <DeviceNameSuggestions existingPasskeys={passkeys} onSelect={handleSuggestionSelect} />
      )}
    </div>
  );
};

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

  const renderCustomContent = (form: any) => (
    <PasskeyFormContent
      form={form}
      passkeys={passkeys}
      isEditMode={isEditMode}
      selectedPasskey={selectedPasskey}
    />
  );

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
      customContent={renderCustomContent}
      buttonText={isEditMode ? PPC.FORM.EDIT_BUTTON_TEXT : PPC.FORM.BUTTON_TEXT}
      buttonIcon={<PasskeyIcon size={16} />}
      width={PPC.FORM.MODAL_WIDTH}
      initialValues={initialValues}
      loading={submitting}
      buttonDisabled={checkButtonDisabled}
      contentWrapperStyle={{
        padding: '1px 0px 0px 0px',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        margin: 0,
      }}
      buttonWrapperStyle={{
        marginTop: 8,
        marginBottom: -12,
        width: '100%',
        padding: '0 0px',
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
    />
  );
};

export default PasskeyFormModal;
