import React, { useState } from 'react';
import { Form } from 'antd';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import type { ScopeFormValue, PermissionLevel } from '../../../../models';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';
import { getScopeRules, formatRuleKey } from '../../../../constants/scopeRules';
import LevelSelector from './LevelSelector';
import RulesList from './RulesList';

export interface ScopeRowProps {
  scopeKey: string;
  scopeLabel: string;
  permissionLevels: readonly { value: PermissionLevel; label: string }[];
  tooltipMap: Record<string, string>;
  onLevelChange?: (scopeKey: string, level: PermissionLevel) => void;
  onRuleToggle?: (scopeKey: string, formattedKey: string, checked: boolean) => void;
  rowPaddingPx?: number;
  isLast?: boolean;
  isLocked?: boolean;
}

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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleScope = () => {
    if (!isLocked) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div
      style={{
        padding: `${rowPaddingPx}px 0`,
        marginBottom: isLast ? 0 : 12,
      }}
    >
      <Form.Item
        noStyle
        shouldUpdate={(prev, curr) =>
          prev?.scopes?.[scopeKey]?.level !== curr?.scopes?.[scopeKey]?.level ||
          prev?.scopes?.[scopeKey]?.rules !== curr?.scopes?.[scopeKey]?.rules
        }
      >
        {({ getFieldValue, setFieldValue }) => {
          const scopeValue = getFieldValue(['scopes', scopeKey]) as ScopeFormValue | undefined;
          const selectedLevel = (scopeValue?.level ||
            RPC.PERMISSION_LEVEL.READ_ONLY) as PermissionLevel;
          const availableRules = getScopeRules(scopeKey, selectedLevel);
          const denyRules = scopeValue?.rules || [];

          // Filter out rules that are not available for the current level (for display only)
          const validDenyRules = denyRules.filter((rule) => {
            const formattedKeys = availableRules.map((r) => formatRuleKey(scopeKey, r.key));
            return formattedKeys.includes(rule);
          });

          const handleLevelChange = (value: PermissionLevel) => {
            const currentScope = getFieldValue(['scopes', scopeKey]) as ScopeFormValue | undefined;
            const newLevel = value;
            const newAvailableRules = getScopeRules(scopeKey, newLevel);

            // Filter existing rules to only include those valid for the new level
            const currentRules = currentScope?.rules || [];
            const formattedKeys = newAvailableRules.map((r) => formatRuleKey(scopeKey, r.key));
            const validRules = currentRules.filter((rule) => formattedKeys.includes(rule));

            setFieldValue(['scopes', scopeKey], {
              level: newLevel,
              rules: validRules,
            });
            onLevelChange?.(scopeKey, newLevel);
          };

          const handleRuleToggle = (formattedKey: string, checked: boolean) => {
            const currentScope = getFieldValue(['scopes', scopeKey]) as ScopeFormValue | undefined;
            const currentRules = currentScope?.rules || [];
            const newDenyRules = checked
              ? // Add rule only if it doesn't already exist
                currentRules.includes(formattedKey)
                ? currentRules
                : [...currentRules, formattedKey]
              : currentRules.filter((r) => r !== formattedKey);
            setFieldValue(['scopes', scopeKey], {
              level: selectedLevel,
              rules: newDenyRules,
            });
            onRuleToggle?.(scopeKey, formattedKey, checked);
          };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ marginBottom: 8 }}>
                <label
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    color: '#0B1F33',
                    marginBottom: 8,
                  }}
                >
                  {scopeLabel}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Form.Item
                    name={['scopes', scopeKey, 'level']}
                    style={{ marginBottom: 0, flex: 1 }}
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
                    <div
                      onClick={toggleScope}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        userSelect: 'none',
                        padding: '4px 0',
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      {isExpanded ? (
                        <AiOutlineDown
                          style={{
                            width: 14,
                            height: 14,
                            color: '#64748b',
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'rotate(0deg)',
                          }}
                        />
                      ) : (
                        <AiOutlineRight
                          style={{
                            width: 14,
                            height: 14,
                            color: '#64748b',
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'rotate(0deg)',
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: 13,
                          color: '#64748b',
                          fontWeight: 400,
                        }}
                      >
                        {RPC.SCOPE.RULES.BLOCK_CERTAIN_RULES}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  maxHeight: isExpanded && availableRules.length > 0 ? '1000px' : '0',
                  overflow: 'hidden',
                  transition:
                    'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, margin-top 0.3s ease',
                  opacity: isExpanded && availableRules.length > 0 ? 1 : 0,
                  marginTop: isExpanded && availableRules.length > 0 ? 16 : 0,
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
