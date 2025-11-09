import React from 'react';
import { Form } from 'antd';
import AvatarPicker from '../avatars/AvatarPicker';

interface LabeledAvatarPickerProps {
  name: string;
  label: string;
  required?: boolean;
  marginBottom?: number;
}

const LabeledAvatarPicker: React.FC<LabeledAvatarPickerProps> = ({
  name,
  label,
  required = false,
  marginBottom = 6,
}) => {
  return (
    <Form.Item
      name={name}
      rules={required ? [{ required: true, message: `Please select ${label.toLowerCase()}` }] : []}
      style={{ marginBottom }}
      className="form-item-compact"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ minWidth: 80, fontSize: 14, color: 'rgba(0, 0, 0, 0.88)' }}>
          {label}
          {required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
        </span>
        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues[name] !== currentValues[name]}>
          {({ getFieldValue, setFieldValue }) => {
            const value = getFieldValue(name);
            return (
              <AvatarPicker
                value={value}
                onChange={(avatar) => setFieldValue(name, avatar)}
                size={48}
              />
            );
          }}
        </Form.Item>
      </div>
    </Form.Item>
  );
};

export default LabeledAvatarPicker;

