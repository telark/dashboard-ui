import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Form, Input } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { PASSKEYS_CONSTANTS as PPC } from '../../../constants/passkeys';
import { createDeviceNameValidator } from '../../../utils';
import DeviceNameSuggestions from '../shared/DeviceNameSuggestions';
import type { Passkey } from '../../../models/passkeys';
import type { FormInstance } from 'antd';

const PasskeyIcon = Icons.Passkey;

interface PasskeyPanelProps {
  open: boolean;
  onClose: () => void;
  isEditMode: boolean;
  selectedPasskey: Passkey | null;
  passkeys: Passkey[];
  submitting: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  form: FormInstance;
  formSyncKey?: number;
}

const PasskeyPanel: React.FC<PasskeyPanelProps> = ({
  open,
  onClose,
  isEditMode,
  selectedPasskey,
  passkeys,
  submitting,
  onSubmit,
  form,
  formSyncKey,
}) => {
  const inputRef = useRef<{ input?: HTMLInputElement | null } | null>(null);
  const [, setFormChanged] = useState(0);

  const onValuesChange = useCallback(() => {
    setFormChanged((n) => n + 1);
  }, []);

  const onFieldsChange = useCallback(() => {
    setFormChanged((n) => n + 1);
  }, []);

  const initialValues = useMemo(
    () =>
      isEditMode && selectedPasskey
        ? { deviceName: selectedPasskey.deviceName }
        : PPC.FORM.INITIAL_VALUES,
    [isEditMode, selectedPasskey],
  );

  const originalDeviceName = useMemo(
    () => (isEditMode && selectedPasskey ? selectedPasskey.deviceName : undefined),
    [isEditMode, selectedPasskey],
  );

  const checkButtonDisabled = (f: FormInstance): boolean => {
    const hasDeviceNameError = (f.getFieldError('deviceName')?.length ?? 0) > 0;
    if (hasDeviceNameError) return true;
    if (!isEditMode || originalDeviceName === undefined) return false;
    const current = f.getFieldValue('deviceName');
    const trimmed = current === undefined || current === null ? '' : String(current).trim();
    if (trimmed === '') return true;
    const b = String(originalDeviceName).trim();
    return trimmed === b;
  };

  const handleSuggestionSelect = (suggestion: string) => {
    form.setFieldValue('deviceName', suggestion);
    const raw = inputRef.current;
    const inputEl =
      raw && typeof raw === 'object' && 'input' in raw
        ? (raw as { input?: HTMLInputElement | null }).input
        : (raw as HTMLInputElement | null);
    if (inputEl instanceof HTMLInputElement) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeInputValueSetter?.call(inputEl, suggestion);
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    form.validateFields(['deviceName']);
  };

  const formContent = (
    <div style={{ marginTop: -4, width: '100%' }}>
      <Form.Item
        name="deviceName"
        label={PPC.FORM.DEVICE_NAME_LABEL}
        style={{ marginBottom: 0 }}
        rules={[
          { required: true, message: PPC.FORM.DEVICE_NAME_REQUIRED },
          {
            validator: createDeviceNameValidator(passkeys, isEditMode, selectedPasskey?.deviceName),
          },
        ]}
        validateTrigger="onChange"
      >
        <Input
          ref={inputRef as React.Ref<React.ComponentRef<typeof Input>>}
          placeholder={PPC.FORM.DEVICE_NAME_PLACEHOLDER}
          style={{ width: '100%' }}
        />
      </Form.Item>
      {!isEditMode && (
        <DeviceNameSuggestions existingPasskeys={passkeys} onSelect={handleSuggestionSelect} />
      )}
    </div>
  );

  void formSyncKey;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={isEditMode ? PPC.FORM.EDIT_TITLE : PPC.FORM.TITLE}
      subtitle={undefined}
      formContent={formContent}
      onSubmit={onSubmit as (values: Record<string, unknown>) => Promise<void>}
      onCancel={onClose}
      submitButtonText={isEditMode ? PPC.FORM.EDIT_BUTTON_TEXT : PPC.FORM.BUTTON_TEXT}
      submitButtonIcon={<PasskeyIcon size={16} />}
      loading={submitting}
      disabled={checkButtonDisabled(form)}
      form={form}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      onFieldsChange={onFieldsChange}
      width={PPC.FORM.MODAL_WIDTH + 80}
    />
  );
};

export default PasskeyPanel;
