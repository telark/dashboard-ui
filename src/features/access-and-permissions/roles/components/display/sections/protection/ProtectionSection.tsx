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
        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => {
            const prevProtection = prev?.protection;
            const currProtection = curr?.protection;
            return (
              prevProtection?.preventDeletion !== currProtection?.preventDeletion ||
              prevProtection?.preventModification !== currProtection?.preventModification ||
              prevProtection?.preventScopeChanges !== currProtection?.preventScopeChanges ||
              prevProtection?.lockName !== currProtection?.lockName ||
              prevProtection?.lockCategory !== currProtection?.lockCategory ||
              prevProtection?.softDelete !== currProtection?.softDelete
            );
          }}
        >
          {({ getFieldValue, setFieldValue }) => {
            const preventDeletion = getFieldValue(['protection', 'preventDeletion']) || false;
            const preventModification = getFieldValue(['protection', 'preventModification']) || false;
            const preventScopeChanges = getFieldValue(['protection', 'preventScopeChanges']) || false;
            const lockName = getFieldValue(['protection', 'lockName']) || false;
            const lockCategory = getFieldValue(['protection', 'lockCategory']) || false;
            const softDelete = getFieldValue(['protection', 'softDelete']) || false;

            return (
              <div style={{ display: 'flex', gap: 24 }}>
                {/* Column 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                  <Switch
                    checked={preventDeletion}
                    onChange={(checked) => setFieldValue(['protection', 'preventDeletion'], checked)}
                    label={RPC.PROTECTION.PREVENT_DELETION_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={preventModification}
                    onChange={(checked) => setFieldValue(['protection', 'preventModification'], checked)}
                    label={RPC.PROTECTION.PREVENT_MODIFICATION_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={preventScopeChanges}
                    onChange={(checked) => setFieldValue(['protection', 'preventScopeChanges'], checked)}
                    label={RPC.PROTECTION.PREVENT_SCOPE_CHANGES_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 0 }}
                  />
                </div>
                {/* Column 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                  <Switch
                    checked={lockName}
                    onChange={(checked) => setFieldValue(['protection', 'lockName'], checked)}
                    label={RPC.PROTECTION.LOCK_NAME_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={lockCategory}
                    onChange={(checked) => setFieldValue(['protection', 'lockCategory'], checked)}
                    label={RPC.PROTECTION.LOCK_CATEGORY_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={softDelete}
                    onChange={(checked) => setFieldValue(['protection', 'softDelete'], checked)}
                    label={RPC.PROTECTION.SOFT_DELETE_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 0 }}
                  />
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
