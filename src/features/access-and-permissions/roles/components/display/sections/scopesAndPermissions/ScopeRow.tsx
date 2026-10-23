import React, { useState } from 'react';
import { Form } from 'antd';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import type { ScopeFormValue, PermissionLevel } from '../../../../models';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';
import { getScopeRules, formatRuleKey } from '../../../../constants/scopeRules';
import {
  DEFAULT_COLORS,
  UNSTYLED_BUTTON,
  FONT_SIZE,
  FONT_WEIGHT,
  MOTION,
  SPACING,
} from '../../../../../../../constants';
import LevelSelector from './LevelSelector';
import RulesList from './RulesList';
import type { ScopeRowProps } from '../../../../models';

const SCOPE_LEVEL_PATHS = RPC.SCOPE.DEFAULT_AREAS.map((area) => ['scopes', area.key, 'level']);
const hasAnyScopeLevel = (scopes?: Record<string, ScopeFormValue | undefined>) =>
  Object.values(scopes ?? {}).some((scope) => scope?.level);

const ScopeRow: React.FC<ScopeRowProps> = ({
  scopeKey,
  scopeLabel,
  permissionLevels,
  descriptionMap,
  rowPaddingPx = 4,
  isLast = false,
  isLocked = false,
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
          const selectedLevel = scopeValue?.level;
          const availableRules = selectedLevel ? getScopeRules(scopeKey, selectedLevel) : [];
          const denyRules = scopeValue?.rules || [];
          const formattedKeys = availableRules.map((r) => formatRuleKey(scopeKey, r.key));
          const validDenyRules = denyRules.filter((rule) => formattedKeys.includes(rule));

          const handleLevelChange = (value?: PermissionLevel) => {
            const newLevel = value;
            const newRules =
              initialScopeValue && initialScopeValue.level === newLevel
                ? initialScopeValue.rules || []
                : [];

            const allScopes = form.getFieldValue('scopes') || {};
            form.setFieldsValue({
              scopes: {
                ...allScopes,
                [scopeKey]: newLevel ? { level: newLevel, rules: newRules } : undefined,
              },
            });
          };

          const handleRuleToggle = (formattedKey: string, checked: boolean) => {
            const currentScope = getFieldValue(['scopes', scopeKey]) as ScopeFormValue | undefined;
            const currentRules = currentScope?.rules || [];
            const normalizeRule = (rule: string) => rule.toLowerCase().trim();
            const normalizedKey = normalizeRule(formattedKey);
            const normalizedRules = currentRules.map(normalizeRule);

            const wouldAdd = checked && !normalizedRules.includes(normalizedKey);
            const wouldRemove = !checked && normalizedRules.includes(normalizedKey);

            if (!selectedLevel || (!wouldAdd && !wouldRemove)) return;

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
          };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.NONE }}>
              {/* A scope without a level has no rules: undefined would flip the input to controlled. */}
              <Form.Item
                name={['scopes', scopeKey, 'rules']}
                hidden
                getValueProps={(rules) => ({ value: rules ?? [] })}
              >
                <input type="hidden" />
              </Form.Item>

              <Form.Item
                label={scopeLabel}
                style={{ marginBottom: isLast ? SPACING.NONE : SPACING.SM }}
                className="form-item-compact"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.XS }}>
                  <Form.Item
                    name={['scopes', scopeKey, 'level']}
                    noStyle
                    dependencies={isLast ? SCOPE_LEVEL_PATHS : undefined}
                    rules={
                      isLast && !isLocked
                        ? [
                            {
                              validator: () =>
                                hasAnyScopeLevel(form.getFieldValue('scopes'))
                                  ? Promise.resolve()
                                  : Promise.reject(new Error(RPC.SCOPE.AT_LEAST_ONE_REQUIRED)),
                            },
                          ]
                        : undefined
                    }
                  >
                    <LevelSelector
                      value={selectedLevel}
                      onChange={handleLevelChange}
                      options={permissionLevels}
                      descriptionMap={descriptionMap}
                      style={{ width: '100%' }}
                      disabled={isLocked}
                    />
                  </Form.Item>
                  {availableRules.length > 0 && (
                    <button
                      type="button"
                      onClick={toggleScope}
                      style={{
                        ...UNSTYLED_BUTTON,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: SPACING.XS,
                        margin: SPACING.NONE,
                        fontFamily: 'inherit',
                        fontSize: FONT_SIZE.SM,
                        color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
                        fontWeight: FONT_WEIGHT.REGULAR,
                        alignSelf: 'flex-start',
                        transition: `color ${MOTION.FAST_MS}ms ${MOTION.EASE}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED;
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
                  transition: `max-height ${MOTION.SLOW_MS}ms ${MOTION.EASE_STANDARD}, opacity ${MOTION.SLOW_MS}ms ${MOTION.EASE}, margin-top ${MOTION.SLOW_MS}ms ${MOTION.EASE}`,
                  opacity: isExpanded && availableRules.length > 0 ? 1 : 0,
                  marginTop: isExpanded && availableRules.length > 0 ? SPACING.SM : SPACING.NONE,
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
