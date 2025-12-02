import React, { useState } from 'react';
import { Form, Select, Tooltip, Checkbox } from 'antd';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import type {
  RolesScopesAndPermissionsListProps,
  ScopeFormValue,
  PermissionLevel,
} from '../../../models';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import { getScopeRules, formatRuleKey } from '../../../constants/scopeRules';

const RolesScopesAndPermissionsList: React.FC<RolesScopesAndPermissionsListProps> = ({
  areas,
  permissionLevels,
  tooltipMap,
  rowPaddingPx = 4,
}) => {
  const [expandedScopes, setExpandedScopes] = useState<Set<string>>(new Set());

  const toggleScope = (scopeKey: string) => {
    setExpandedScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scopeKey)) {
        next.delete(scopeKey);
      } else {
        next.add(scopeKey);
      }
      return next;
    });
  };

  return (
    <>
      {areas.map((area: { key: string; label: string }, index: number) => (
          <div
          key={area.key}
            style={{
            padding: `${rowPaddingPx}px 0`,
            marginBottom: index < areas.length - 1 ? 12 : 0,
          }}
        >
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) =>
              prev?.scopes?.[area.key]?.level !== curr?.scopes?.[area.key]?.level ||
              prev?.scopes?.[area.key]?.rules !== curr?.scopes?.[area.key]?.rules
            }
          >
            {({ getFieldValue, setFieldValue }) => {
              const scopeValue = getFieldValue(['scopes', area.key]) as ScopeFormValue | undefined;
              const selectedLevel = (scopeValue?.level ||
                RPC.PERMISSION_LEVEL.READ_ONLY) as PermissionLevel;
              const availableRules = getScopeRules(area.key, selectedLevel);
              const denyRules = scopeValue?.rules || [];
              const isExpanded = expandedScopes.has(area.key);

              // Filter out rules that are not available for the current level (for display only)
              const validDenyRules = denyRules.filter((rule) => {
                const formattedKeys = availableRules.map((r) => formatRuleKey(area.key, r.key));
                return formattedKeys.includes(rule);
              });

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <Form.Item
                    name={['scopes', area.key, 'level']}
                    label={<span style={{ fontWeight: 700, color: '#0B1F33' }}>{area.label}</span>}
                    style={{ marginBottom: 0 }}
                    className="form-item-compact"
                    rules={[{ required: true, message: 'Please select a permission level' }]}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Select
                        placeholder="Select permission level"
                        style={{ flex: 1 }}
                        value={selectedLevel}
                        options={permissionLevels.map((level) => ({
                          value: level.value,
                      label: (
                            <Tooltip title={tooltipMap[level.value]}>
                              <span>{level.label}</span>
                        </Tooltip>
                      ),
                        }))}
                        onChange={(value) => {
                          const currentScope = getFieldValue(['scopes', area.key]) as
                            | ScopeFormValue
                            | undefined;
                          const newLevel = value as PermissionLevel;
                          const newAvailableRules = getScopeRules(area.key, newLevel);
                          
                          // Filter existing rules to only include those valid for the new level
                          const currentRules = currentScope?.rules || [];
                          const formattedKeys = newAvailableRules.map((r) => formatRuleKey(area.key, r.key));
                          const validRules = currentRules.filter((rule) => formattedKeys.includes(rule));
                          
                          setFieldValue(['scopes', area.key], {
                            level: newLevel,
                            rules: validRules,
                          });
                        }}
                      />
                      {availableRules.length > 0 && (
                        <div
                          onClick={() => toggleScope(area.key)}
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
                </Form.Item>

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
                      <div
                        style={{
                          padding: '20px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                          }}
                        >
                          {availableRules.map((rule) => {
                            const formattedKey = formatRuleKey(area.key, rule.key);
                            const isChecked = validDenyRules.includes(formattedKey);
                            return (
                              <div
                                key={rule.key}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '12px 16px',
                                  background: isChecked ? '#fef2f2' : '#f8fafc',
                                  border: `1px solid ${isChecked ? '#fecaca' : '#e2e8f0'}`,
                                  borderRadius: 8,
                                  transition: 'all 0.2s ease',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isChecked) {
                                    e.currentTarget.style.background = '#f1f5f9';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isChecked) {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                  }
                                }}
                                onClick={() => {
                                  const currentScope = getFieldValue(['scopes', area.key]) as
                                    | ScopeFormValue
                                    | undefined;
                                  const currentRules = currentScope?.rules || [];
                                  // Only toggle if clicking outside the checkbox
                                  if (!isChecked) {
                                    // Add rule only if it doesn't already exist
                                    if (!currentRules.includes(formattedKey)) {
                                      setFieldValue(['scopes', area.key], {
                                        level: selectedLevel,
                                        rules: [...currentRules, formattedKey],
                                      });
                                    }
                                  } else {
                                    // Remove rule
                                    setFieldValue(['scopes', area.key], {
                                      level: selectedLevel,
                                      rules: currentRules.filter((r) => r !== formattedKey),
                                    });
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const currentScope = getFieldValue(['scopes', area.key]) as
                                      | ScopeFormValue
                                      | undefined;
                                    const currentRules = currentScope?.rules || [];
                                    const newDenyRules = e.target.checked
                                      ? // Add rule only if it doesn't already exist
                                        currentRules.includes(formattedKey)
                                        ? currentRules
                                        : [...currentRules, formattedKey]
                                      : currentRules.filter((r) => r !== formattedKey);
                                    setFieldValue(['scopes', area.key], {
                                      level: selectedLevel,
                                      rules: newDenyRules,
                                    });
                                  }}
                                  style={{
                                    margin: 0,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: 14,
                                      color: '#475569',
                                      fontWeight: 500,
                                      marginLeft: 8,
                                    }}
                                  >
                                    {rule.label}
                                  </span>
                                </Checkbox>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
            </Form.Item>
        </div>
      ))}
    </>
  );
};

export default RolesScopesAndPermissionsList;
