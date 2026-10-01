import React from 'react';
import { Tooltip } from 'antd';
import RowTag from '../../../../../../components/display/table/RowTag';
import { DEFAULT_COLORS, TIME_FORMATS } from '../../../../../../constants';
import { formatDateTime, toTimestamp } from '../../../../../../utils/shared/time';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { UserInvite } from '../../../models';

const PILL = UC.LABELS.INVITE_PILL;

// Display only: auth enforces the expiry, so a pill that turns late never keeps a link alive.
const isPending = (invite: UserInvite): boolean => toTimestamp(invite.expiresAt) > Date.now();

interface InvitePillProps {
  invite: UserInvite;
}

const InvitePill: React.FC<InvitePillProps> = ({ invite }) => {
  const when = formatDateTime(invite.expiresAt, TIME_FORMATS.DATE_TIME);
  const pill = isPending(invite)
    ? { text: PILL.PENDING, accent: DEFAULT_COLORS.INFO, tooltip: PILL.EXPIRES_AT(when) }
    : { text: PILL.EXPIRED, accent: DEFAULT_COLORS.WARNING, tooltip: PILL.EXPIRED_AT(when) };

  return (
    <Tooltip title={pill.tooltip}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>
        <RowTag
          text={pill.text}
          accent={pill.accent}
          fontSize={UC.SIZES.CHIP_FONT}
          capitalize={false}
        />
      </span>
    </Tooltip>
  );
};

export default InvitePill;
