import React from 'react';
import { Form, Switch } from 'antd';
import Section from '../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants/shared/colors';

const ProtectionSection: React.FC = () => {
  return (
    <Section
      title={RPC.PROTECTION.TITLE}
      subtitle={RPC.PROTECTION.SUBTITLE}
      content={
        <Form.Item noStyle shouldUpdate={(prev, curr) => prev?.protection !== curr?.protection}>
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
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, marginRight: 8, minWidth: 200 }}>
                      {RPC.PROTECTION.PREVENT_DELETION_LABEL}
                    </span>
                    <Switch
                      checked={preventDeletion}
                      onChange={(checked) => setFieldValue(['protection', 'preventDeletion'], checked)}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: 8,
                        backgroundColor: preventDeletion ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, marginRight: 8, minWidth: 200 }}>
                      {RPC.PROTECTION.PREVENT_MODIFICATION_LABEL}
                    </span>
                    <Switch
                      checked={preventModification}
                      onChange={(checked) => setFieldValue(['protection', 'preventModification'], checked)}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: 8,
                        backgroundColor: preventModification ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, marginRight: 8, minWidth: 200 }}>
                      {RPC.PROTECTION.PREVENT_SCOPE_CHANGES_LABEL}
                    </span>
                    <Switch
                      checked={preventScopeChanges}
                      onChange={(checked) => setFieldValue(['protection', 'preventScopeChanges'], checked)}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: 8,
                        backgroundColor: preventScopeChanges ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
                </div>
                {/* Column 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, marginRight: 8, minWidth: 200 }}>
                      {RPC.PROTECTION.LOCK_NAME_LABEL}
                    </span>
                    <Switch
                      checked={lockName}
                      onChange={(checked) => setFieldValue(['protection', 'lockName'], checked)}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: 8,
                        backgroundColor: lockName ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, marginRight: 8, minWidth: 200 }}>
                      {RPC.PROTECTION.LOCK_CATEGORY_LABEL}
                    </span>
                    <Switch
                      checked={lockCategory}
                      onChange={(checked) => setFieldValue(['protection', 'lockCategory'], checked)}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: 8,
                        backgroundColor: lockCategory ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, marginRight: 8, minWidth: 200 }}>
                      {RPC.PROTECTION.SOFT_DELETE_LABEL}
                    </span>
                    <Switch
                      checked={softDelete}
                      onChange={(checked) => setFieldValue(['protection', 'softDelete'], checked)}
                      checkedChildren="On"
                      unCheckedChildren="Off"
                      style={{
                        marginLeft: 8,
                        backgroundColor: softDelete ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.SWITCH_OFF,
                      }}
                    />
                  </div>
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
