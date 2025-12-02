import React from 'react';
import RulesItem from './RulesItem';
import type { ScopeRule } from '../../../../constants/scopeRules';

export interface RulesListProps {
  rules: ScopeRule[];
  scopeKey: string;
  selectedRules: string[];
  onRuleToggle: (formattedKey: string, checked: boolean) => void;
  formatRuleKey: (scope: string, ruleKey: string) => string;
}

const RulesList: React.FC<RulesListProps> = ({
  rules,
  scopeKey,
  selectedRules,
  onRuleToggle,
  formatRuleKey,
}) => {
  return (
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
        {rules.map((rule) => {
          const formattedKey = formatRuleKey(scopeKey, rule.key);
          const isChecked = selectedRules.includes(formattedKey);
          return (
            <RulesItem
              key={rule.key}
              ruleLabel={rule.label}
              isChecked={isChecked}
              onToggle={(checked) => onRuleToggle(formattedKey, checked)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RulesList;

