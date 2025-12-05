import React, { useState } from 'react';
import { Form } from 'antd';
import Section from '../../../../../../../components/display/sections/Section';
import { Switch } from '../../../../../../../components/display/inputs';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';

interface ProtectionSectionProps {
  onManualChange?: () => void;
}

const ProtectionSection: React.FC<ProtectionSectionProps> = ({ onManualChange }) => {
  const form = Form.useFormInstance();
  const [localPreventScopeChanges, setLocalPreventScopeChanges] = useState<boolean | null>(null);

  return (
    <Section
      title={RPC.PROTECTION.TITLE}
      subtitle={RPC.PROTECTION.SUBTITLE}
      content={
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currValues) => {
            const prevProtection = prevValues?.protection;
            const currProtection = currValues?.protection;
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
            const preventModification =
              getFieldValue(['protection', 'preventModification']) || false;
            const formPreventScopeChanges =
              getFieldValue(['protection', 'preventScopeChanges']) || false;
            const preventScopeChanges =
              localPreventScopeChanges !== null ? localPreventScopeChanges : formPreventScopeChanges;
            const lockName = getFieldValue(['protection', 'lockName']) || false;
            const lockCategory = getFieldValue(['protection', 'lockCategory']) || false;
            const softDelete = getFieldValue(['protection', 'softDelete']) || false;

            const isSoftDeleteDisabled = preventDeletion;

            const updateProtectionFields = (updates: Record<string, boolean>) => {
              const hasPreventScopeChanges = 'preventScopeChanges' in updates;
              if (hasPreventScopeChanges) {
                const newValue = updates.preventScopeChanges;
                setLocalPreventScopeChanges(newValue);
                setTimeout(() => {
                  setFieldValue(['protection', 'preventScopeChanges'], newValue);
                  setTimeout(() => {
                    setLocalPreventScopeChanges(null);
                    onManualChange?.();
                  }, 100);
                }, 300);
              } else {
                Object.entries(updates).forEach(([field, value]) => {
                  setFieldValue(['protection', field], value);
                });
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    onManualChange?.();
                  });
                });
              }
            };

            return (
              <div style={{ display: 'flex', gap: 24 }}>
                {/* Column 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                  <Switch
                    checked={preventDeletion}
                    onChange={(checked) => {
                      updateProtectionFields({
                        preventDeletion: checked,
                        ...(checked ? { softDelete: false } : {}),
                      });
                    }}
                    label={RPC.PROTECTION.PREVENT_DELETION_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={preventModification}
                    onChange={(checked) => updateProtectionFields({ preventModification: checked })}
                    label={RPC.PROTECTION.PREVENT_MODIFICATION_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={preventScopeChanges}
                    onChange={(checked) => updateProtectionFields({ preventScopeChanges: checked })}
                    label={RPC.PROTECTION.PREVENT_SCOPE_CHANGES_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 0 }}
                  />
                </div>
                {/* Column 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                  <Switch
                    checked={lockName}
                    onChange={(checked) => updateProtectionFields({ lockName: checked })}
                    label={RPC.PROTECTION.LOCK_NAME_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={lockCategory}
                    onChange={(checked) => updateProtectionFields({ lockCategory: checked })}
                    label={RPC.PROTECTION.LOCK_CATEGORY_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 12 }}
                  />
                  <Switch
                    checked={softDelete}
                    onChange={(checked) => {
                      if (!isSoftDeleteDisabled) {
                        updateProtectionFields({ softDelete: checked });
                      }
                    }}
                    label={RPC.PROTECTION.SOFT_DELETE_LABEL}
                    labelStyle={{ minWidth: 200 }}
                    containerStyle={{ marginBottom: 0 }}
                    disabled={isSoftDeleteDisabled}
                    tooltip={
                      isSoftDeleteDisabled ? RPC.PROTECTION.SOFT_DELETE_DISABLED_NOTE : undefined
                    }
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
