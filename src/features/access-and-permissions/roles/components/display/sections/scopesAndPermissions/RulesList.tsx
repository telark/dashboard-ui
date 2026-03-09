import React from 'react';
import RulesItem from './RulesItem';
import type { RulesListProps } from '../../../../models';

const RulesList: React.FC<RulesListProps> = ({
  rules,
  scopeKey,
  selectedRules,
  onRuleToggle,
  formatRuleKey,
}) => {
  return (
    <div
      className="role-list-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {rules.map((rule) => {
        const formattedKey = formatRuleKey(scopeKey, rule.key);
        const isChecked = selectedRules.includes(formattedKey);
        return (
          <RulesItem
            key={rule.key}
            ruleLabel={rule.label}
            formattedKey={formattedKey}
            isChecked={isChecked}
            onToggle={(checked) => onRuleToggle(formattedKey, checked)}
          />
        );
      })}
    </div>
  );
};

export default RulesList;
