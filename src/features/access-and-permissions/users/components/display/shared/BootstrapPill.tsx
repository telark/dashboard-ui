import React from 'react';
import { Tag, Tooltip } from 'antd';
import { DEFAULT_COLORS, TAG_CLASS, getPillColor } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';

const BootstrapPill: React.FC = () => (
  <Tooltip title={UC.LABELS.BOOTSTRAP_PILL.TOOLTIP}>
    <span style={{ display: 'inline-flex', flexShrink: 0 }}>
      <Tag color={getPillColor(DEFAULT_COLORS.INFO)} className={TAG_CLASS.MEDIUM}>
        {UC.LABELS.BOOTSTRAP_PILL.LABEL}
      </Tag>
    </span>
  </Tooltip>
);

export default BootstrapPill;
