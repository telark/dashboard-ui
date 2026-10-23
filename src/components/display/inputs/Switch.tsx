import React from 'react';
import { Switch as AntSwitch, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../constants/shared/colors';
import { BUTTON_COLORS } from '../../../constants/layout/buttons';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../constants';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  labelStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  tooltip?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  checkedChildren = 'On',
  unCheckedChildren = 'Off',
  labelStyle,
  containerStyle,
  tooltip,
}) => {
  const switchElement = (
    <div style={{ display: 'flex', alignItems: 'center', ...containerStyle }}>
      {label && (
        <span
          style={{
            fontSize: FONT_SIZE.BASE,
            fontWeight: FONT_WEIGHT.SEMIBOLD,
            marginRight: SPACING.SM,
            ...labelStyle,
          }}
        >
          {label}
        </span>
      )}
      <AntSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        style={{
          marginLeft: label ? SPACING.SM : SPACING.NONE,
          backgroundColor: checked ? DEFAULT_COLORS.SUCCESS : BUTTON_COLORS.SWITCH_OFF,
        }}
      />
    </div>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{switchElement}</Tooltip>;
  }

  return switchElement;
};

export default Switch;
