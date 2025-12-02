import React from 'react';
import { Checkbox } from 'antd';

export interface RulesItemProps {
  ruleLabel: string;
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
}

const RulesItem: React.FC<RulesItemProps> = ({
  ruleLabel,
  isChecked,
  onToggle,
}) => {
  return (
    <div
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
      onClick={() => onToggle(!isChecked)}
    >
      <Checkbox
        checked={isChecked}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(e.target.checked);
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
          {ruleLabel}
        </span>
      </Checkbox>
    </div>
  );
};

export default RulesItem;

