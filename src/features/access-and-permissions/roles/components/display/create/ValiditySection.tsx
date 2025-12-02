import React from 'react';
import { Form, Select } from 'antd';
import Section from '../../../../../../components/display/sections/Section';
import { Switch, NumberInput, DatePicker } from '../../../../../../components/display/inputs';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import dayjs from 'dayjs';

const ValiditySection: React.FC = () => {
  const validityTypeOptions = [
    { value: RPC.VALIDITY_TYPES.PERMANENT, label: 'Permanent' },
    { value: RPC.VALIDITY_TYPES.TEMPORARY, label: 'Temporary' },
    { value: RPC.VALIDITY_TYPES.SESSION_BASED, label: 'Session Based' },
  ];

  const expirationModelOptions = [
    { value: RPC.VALIDITY.EXPIRATION_MODEL_OPTIONS.EXPIRES_AT, label: 'Expires At' },
    { value: RPC.VALIDITY.EXPIRATION_MODEL_OPTIONS.DURATION, label: 'Duration' },
  ];

  return (
    <Section
      title={RPC.VALIDITY.TITLE}
      subtitle={RPC.VALIDITY.SUBTITLE}
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Form.Item
            name={['validity', 'type']}
            label={RPC.VALIDITY.TYPE_LABEL}
            rules={[{ required: true, message: 'Please select a validity type' }]}
            style={{ marginBottom: 12 }}
            className="form-item-compact"
          >
            <Select placeholder="Select validity type" options={validityTypeOptions} />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev?.validity?.type !== curr?.validity?.type}
          >
            {({ getFieldValue, setFieldValue }) => {
              const validityType = getFieldValue(['validity', 'type']);

              if (validityType === RPC.VALIDITY_TYPES.TEMPORARY) {
                return (
                  <>
                    <Form.Item
                      name={['validity', 'expirationModel']}
                      label={RPC.VALIDITY.EXPIRATION_MODEL_LABEL}
                      rules={[{ required: true, message: 'Please select an expiration model' }]}
                      style={{ marginBottom: 12 }}
                      className="form-item-compact"
                    >
                      <Select
                        placeholder="Select expiration model"
                        options={expirationModelOptions}
                        onChange={() => {
                          // Clear the other field when switching models
                          const currentValidity = getFieldValue('validity') || {};
                          if (
                            currentValidity.expirationModel ===
                            RPC.VALIDITY.EXPIRATION_MODEL_OPTIONS.EXPIRES_AT
                          ) {
                            setFieldValue(['validity', 'durationHours'], undefined);
                          } else {
                            setFieldValue(['validity', 'expiresAt'], undefined);
                          }
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) =>
                        prev?.validity?.expirationModel !== curr?.validity?.expirationModel
                      }
                    >
                      {({ getFieldValue: getFieldValueInner }) => {
                        const expirationModel = getFieldValueInner(['validity', 'expirationModel']);

                        if (expirationModel === RPC.VALIDITY.EXPIRATION_MODEL_OPTIONS.EXPIRES_AT) {
                          return (
                            <Form.Item
                              name={['validity', 'expiresAt']}
                              label={RPC.VALIDITY.EXPIRES_AT_LABEL}
                              rules={[
                                { required: true, message: 'Please select an expiration date' },
                              ]}
                              style={{ marginBottom: 12 }}
                              className="form-item-compact"
                            >
                              <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                placeholder={RPC.VALIDITY.EXPIRES_AT_PLACEHOLDER}
                                style={{ width: '100%' }}
                                disabledDate={(current) =>
                                  current ? current < dayjs().startOf('day') : false
                                }
                              />
                            </Form.Item>
                          );
                        }

                        if (expirationModel === RPC.VALIDITY.EXPIRATION_MODEL_OPTIONS.DURATION) {
                          return (
                            <Form.Item
                              name={['validity', 'durationHours']}
                              label={RPC.VALIDITY.DURATION_LABEL}
                              rules={[
                                { required: true, message: 'Please enter duration in hours' },
                              ]}
                              style={{ marginBottom: 12 }}
                              className="form-item-compact"
                            >
                              <NumberInput
                                min={1}
                                placeholder={RPC.VALIDITY.DURATION_PLACEHOLDER}
                                style={{ width: '100%' }}
                                addonAfter="hours"
                              />
                            </Form.Item>
                          );
                        }

                        return null;
                      }}
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) => prev?.validity?.autoRevoke !== curr?.validity?.autoRevoke}
                    >
                      {({ getFieldValue: getFieldValueInner, setFieldValue: setFieldValueInner }) => {
                        const autoRevokeInner = getFieldValueInner(['validity', 'autoRevoke']) || false;
                        return (
                          <Switch
                            checked={autoRevokeInner}
                            onChange={(checked) => setFieldValueInner(['validity', 'autoRevoke'], checked)}
                            label={RPC.VALIDITY.AUTO_REVOKE_LABEL}
                            containerStyle={{ marginTop: 20 }}
                          />
                        );
                      }}
                    </Form.Item>
                  </>
                );
              }

              // Session-based and permanent don't show any additional fields
              return null;
            }}
          </Form.Item>
        </div>
      }
    />
  );
};

export default ValiditySection;
