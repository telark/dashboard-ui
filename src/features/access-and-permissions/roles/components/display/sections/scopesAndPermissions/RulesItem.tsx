import React, { useMemo } from 'react';
import { Checkbox } from 'antd';
import { DEFAULT_COLORS } from '../../../../../../../constants';
import type { RulesItemProps } from '../../../../models';

const RulesItem: React.FC<RulesItemProps> = ({ ruleLabel, formattedKey, isChecked, onToggle }) => {
  const checkboxId = useMemo(
    () => `rule-checkbox-${formattedKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    [formattedKey],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 14px',
        background: DEFAULT_COLORS.BACKGROUND_LIGHT,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        borderRadius: 8,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        minHeight: 44,
        width: '100%',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_HOVER;
        e.currentTarget.style.borderColor = DEFAULT_COLORS.BORDER_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_LIGHT;
        e.currentTarget.style.borderColor = DEFAULT_COLORS.BORDER_LIGHT;
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest?.('.ant-checkbox-wrapper')) return;
        onToggle(!isChecked);
      }}
    >
      <Checkbox
        id={checkboxId}
        checked={isChecked}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(e.target.checked);
        }}
        style={{ margin: 0, width: '100%' }}
      >
        <span
          style={{
            fontSize: 14,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {ruleLabel}
        </span>
      </Checkbox>
    </div>
  );
};

export default RulesItem;
