import React, { useState } from 'react';
import { Form } from 'antd';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import type { ScopeFormValue, PermissionLevel } from '../../../../models';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';
import { getScopeRules, formatRuleKey } from '../../../../constants/scopeRules';
import LevelSelector from './LevelSelector';
import RulesList from './RulesList';
import type { ScopeRowProps } from '../../../../models';

const ScopeRow: React.FC<ScopeRowProps> = ({
  scopeKey,
  scopeLabel,
  permissionLevels,
  tooltipMap,
  onLevelChange,
  onRuleToggle,
  rowPaddingPx = 4,
  isLast = false,
  isLocked = false,
  onManualChange,
  initialScopeValue,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const form = Form.useFormInstance();

  const toggleScope = () => {
    if (!isLocked) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div
      style={{
        padding: `${rowPaddingPx}px 0`,
      }}
    >
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.scopes?.[scopeKey]?.level !== curr?.scopes?.[scopeKey]?.level ||
          prev?.scopes?.[scopeKey]?.rules !== curr?.scopes?.[scopeKey]?.rules
        }
      >
        {({ getFieldValue }) => {
          const scopeValue = getFieldValue(['scopes', scopeKey]) as ScopeFormValue | undefined;
          const selectedLevel = (scopeValue?.level ||
            RPC.PERMISSION_LEVEL.READ_ONLY) as PermissionLevel;
          const availableRules = getScopeRules(scopeKey, selectedLevel);
          const denyRules = scopeValue?.rules || [];
          const formattedKeys = availableRules.map((r) => formatRuleKey(scopeKey, r.key));
          const validDenyRules = denyRules.filter((rule) => formattedKeys.includes(rule));

          const handleLevelChange = (value: PermissionLevel) => {
            const newLevel = value;
            const newRules =
              initialScopeValue && initialScopeValue.level === newLevel
                ? initialScopeValue.rules || []
                : [];

            const allScopes = form.getFieldValue('scopes') || {};
            form.setFieldsValue({
              scopes: {
                ...allScopes,
                [scopeKey]: { level: newLevel, rules: newRules },
              },
            });

            requestAnimationFrame(() => onManualChange?.());
            onLevelChange?.(scopeKey, newLevel);
          };

          const handleRuleToggle = (formattedKey: string, checked: boolean) => {
            const currentScope = getFieldValue(['scopes', scopeKey]) as ScopeFormValue | undefined;
            const currentRules = currentScope?.rules || [];
            const normalizeRule = (rule: string) => rule.toLowerCase().trim();
            const normalizedKey = normalizeRule(formattedKey);
            const normalizedRules = currentRules.map(normalizeRule);

            const wouldAdd = checked && !normalizedRules.includes(normalizedKey);
            const wouldRemove = !checked && normalizedRules.includes(normalizedKey);

            if (!wouldAdd && !wouldRemove) return;

            const newDenyRules = checked
              ? [...currentRules, formattedKey]
              : currentRules.filter((r) => normalizeRule(r) !== normalizedKey);

            const allScopes = form.getFieldValue('scopes') || {};
            form.setFieldsValue({
              scopes: {
                ...allScopes,
                [scopeKey]: { level: selectedLevel, rules: newDenyRules },
              },
            });

            requestAnimationFrame(() => onManualChange?.());
            onRuleToggle?.(scopeKey, formattedKey, checked);
          };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <Form.Item name={['scopes', scopeKey, 'rules']} hidden>
                <input type="hidden" />
              </Form.Item>

              <Form.Item
                label={scopeLabel}
                style={{ marginBottom: isLast ? 0 : 8 }}
                className="form-item-compact"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Form.Item
                    name={['scopes', scopeKey, 'level']}
                    noStyle
                    rules={[{ required: true, message: 'Please select a permission level' }]}
                  >
                    <LevelSelector
                      value={selectedLevel}
                      onChange={handleLevelChange}
                      options={permissionLevels}
                      tooltipMap={tooltipMap}
                      style={{ width: '100%' }}
                      disabled={isLocked}
                    />
                  </Form.Item>
                  {availableRules.length > 0 && (
                    <button
                      type="button"
                      onClick={toggleScope}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: 0,
                        margin: 0,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 12,
                        color: '#64748b',
                        fontWeight: 400,
                        alignSelf: 'flex-start',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0B1F33';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#64748b';
                      }}
                    >
                      {isExpanded ? (
                        <AiOutlineDown style={{ width: 12, height: 12, flexShrink: 0 }} />
                      ) : (
                        <AiOutlineRight style={{ width: 12, height: 12, flexShrink: 0 }} />
                      )}
                      <span>{RPC.SCOPE.RULES.BLOCK_CERTAIN_RULES}</span>
                    </button>
                  )}
                </div>
              </Form.Item>

              <div
                style={{
                  maxHeight: isExpanded && availableRules.length > 0 ? '1000px' : '0',
                  overflow: 'hidden',
                  transition:
                    'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.3s ease',
                  opacity: isExpanded && availableRules.length > 0 ? 1 : 0,
                  marginTop: isExpanded && availableRules.length > 0 ? 8 : 0,
                }}
              >
                {availableRules.length > 0 && (
                  <RulesList
                    rules={availableRules}
                    scopeKey={scopeKey}
                    selectedRules={validDenyRules}
                    onRuleToggle={handleRuleToggle}
                    formatRuleKey={formatRuleKey}
                  />
                )}
              </div>
            </div>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default ScopeRow;
