import React from 'react';
import { Form } from 'antd';
import Section from '../../../../../../../components/display/sections/Section';
import { Switch } from '../../../../../../../components/display/inputs';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';

const ProtectionSection: React.FC = () => {
  return (
    <Section
      title={RPC.PROTECTION.TITLE}
      subtitle={RPC.PROTECTION.SUBTITLE}
      content={
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev?.protection !== curr?.protection}>
          {({ getFieldValue, setFieldValue }) => {
            const preventDeletion = Boolean(getFieldValue(['protection', 'preventDeletion']));
            const preventModification = Boolean(getFieldValue(['protection', 'preventModification']));
            const preventScopeChanges = Boolean(getFieldValue(['protection', 'preventScopeChanges']));
            const lockName = Boolean(getFieldValue(['protection', 'lockName']));
            const lockCategory = Boolean(getFieldValue(['protection', 'lockCategory']));
            const softDelete = Boolean(getFieldValue(['protection', 'softDelete']));

            return (
              <div style={{ display: 'flex', gap: 24 }}>
                {/* Column 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                  <Form.Item name={['protection', 'preventDeletion']} noStyle>
                    <Switch
                      checked={preventDeletion}
                      onChange={(checked) => setFieldValue(['protection', 'preventDeletion'], checked)}
                      label={RPC.PROTECTION.PREVENT_DELETION_LABEL}
                      labelStyle={{ minWidth: 200 }}
                      containerStyle={{ marginBottom: 12 }}
                    />
                  </Form.Item>
                  <Form.Item name={['protection', 'preventModification']} noStyle>
                    <Switch
                      checked={preventModification}
                      onChange={(checked) => setFieldValue(['protection', 'preventModification'], checked)}
                      label={RPC.PROTECTION.PREVENT_MODIFICATION_LABEL}
                      labelStyle={{ minWidth: 200 }}
                      containerStyle={{ marginBottom: 12 }}
                    />
                  </Form.Item>
                  <Form.Item name={['protection', 'preventScopeChanges']} noStyle>
                    <Switch
                      checked={preventScopeChanges}
                      onChange={(checked) => setFieldValue(['protection', 'preventScopeChanges'], checked)}
                      label={RPC.PROTECTION.PREVENT_SCOPE_CHANGES_LABEL}
                      labelStyle={{ minWidth: 200 }}
                      containerStyle={{ marginBottom: 0 }}
                    />
                  </Form.Item>
                </div>
                {/* Column 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                  <Form.Item name={['protection', 'lockName']} noStyle>
                    <Switch
                      checked={lockName}
                      onChange={(checked) => setFieldValue(['protection', 'lockName'], checked)}
                      label={RPC.PROTECTION.LOCK_NAME_LABEL}
                      labelStyle={{ minWidth: 200 }}
                      containerStyle={{ marginBottom: 12 }}
                    />
                  </Form.Item>
                  <Form.Item name={['protection', 'lockCategory']} noStyle>
                    <Switch
                      checked={lockCategory}
                      onChange={(checked) => setFieldValue(['protection', 'lockCategory'], checked)}
                      label={RPC.PROTECTION.LOCK_CATEGORY_LABEL}
                      labelStyle={{ minWidth: 200 }}
                      containerStyle={{ marginBottom: 12 }}
                    />
                  </Form.Item>
                  <Form.Item name={['protection', 'softDelete']} noStyle>
                    <Switch
                      checked={softDelete}
                      onChange={(checked) => setFieldValue(['protection', 'softDelete'], checked)}
                      label={RPC.PROTECTION.SOFT_DELETE_LABEL}
                      labelStyle={{ minWidth: 200 }}
                      containerStyle={{ marginBottom: 0 }}
                    />
                  </Form.Item>
                </div>
              </div>
            );
          }}
        </Form.Item>
      }
    />
  );
};

export default ProtectionSection;
