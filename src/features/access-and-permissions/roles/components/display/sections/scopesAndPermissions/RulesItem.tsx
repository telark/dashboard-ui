import React, { useMemo } from 'react';
import { Checkbox } from 'antd';
import {
  DEFAULT_COLORS,
  HAIRLINE,
  FONT_SIZE,
  FONT_WEIGHT,
  MOTION,
  RADIUS,
  SPACING,
} from '../../../../../../../constants';
import type { RulesItemProps } from '../../../../models';

const RulesItem: React.FC<RulesItemProps> = ({ ruleLabel, formattedKey, isChecked, onToggle }) => {
  const checkboxId = useMemo(
    () => `rule-checkbox-${formattedKey.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
    [formattedKey],
  );

  return (
    <div
      style={{
        // Off scale, kept exact: padding 14 (MD to LG).
        display: 'flex',
        alignItems: 'center',
        padding: `${SPACING.SM}px 14px`,
        background: DEFAULT_COLORS.SURFACE_WHITE,
        border: HAIRLINE.SURFACE_BORDER,
        borderRadius: RADIUS.MD,
        transition: `all ${MOTION.BASE_MS}ms ${MOTION.EASE}`,
        cursor: 'pointer',
        minHeight: 44,
        width: '100%',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = DEFAULT_COLORS.SURFACE_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = DEFAULT_COLORS.SURFACE_WHITE;
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
        style={{ margin: SPACING.NONE, width: '100%' }}
      >
        <span
          style={{
            // Off scale, kept exact: lineHeight 1.4 (SNUG to BASE).
            fontSize: FONT_SIZE.BASE,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE,
            fontWeight: FONT_WEIGHT.MEDIUM,
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
