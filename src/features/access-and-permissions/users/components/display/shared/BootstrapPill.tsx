import React from 'react';
import { Tooltip } from 'antd';
import RowTag from '../../../../../../components/display/table/RowTag';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';

const BootstrapPill: React.FC = () => (
  <Tooltip title={UC.LABELS.BOOTSTRAP_PILL.TOOLTIP}>
    <span style={{ display: 'inline-flex', flexShrink: 0 }}>
      <RowTag
        text={UC.LABELS.BOOTSTRAP_PILL.LABEL}
        accent={DEFAULT_COLORS.INFO}
        fontSize={UC.SIZES.CHIP_FONT}
      />
    </span>
  </Tooltip>
);

export default BootstrapPill;
