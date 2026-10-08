import React from 'react';
import { Tag, Tooltip } from 'antd';
import { DEFAULT_COLORS, TAG_CLASS, TIME_FORMATS, getPillColor } from '../../../../../../constants';
import { formatDateTime, toTimestamp } from '../../../../../../utils/shared/time';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { UserInvite } from '../../../models';

const PILL = UC.LABELS.INVITE_PILL;

// Display only: auth enforces the expiry, so a pill that turns late never keeps a link alive.
const isPending = (invite: UserInvite): boolean => toTimestamp(invite.expiresAt) > Date.now();

// An open link outranks the record of an earlier one being used.
const pillFor = (invite?: UserInvite, acceptedAt?: string) => {
  if (invite) {
    const when = formatDateTime(invite.expiresAt, TIME_FORMATS.DATE_TIME);
    return isPending(invite)
      ? { text: PILL.PENDING, accent: DEFAULT_COLORS.INFO, tooltip: PILL.EXPIRES_AT(when) }
      : { text: PILL.EXPIRED, accent: DEFAULT_COLORS.WARNING, tooltip: PILL.EXPIRED_AT(when) };
  }
  if (!acceptedAt) return null;
  const when = formatDateTime(acceptedAt, TIME_FORMATS.DATE_TIME);
  return { text: PILL.ENROLLED, accent: DEFAULT_COLORS.SUCCESS, tooltip: PILL.ENROLLED_AT(when) };
};

interface InvitePillProps {
  invite?: UserInvite;
  acceptedAt?: string;
}

const InvitePill: React.FC<InvitePillProps> = ({ invite, acceptedAt }) => {
  const pill = pillFor(invite, acceptedAt);
  if (!pill) return null;

  return (
    <Tooltip title={pill.tooltip}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>
        <Tag color={getPillColor(pill.accent)} className={`${TAG_CLASS.MEDIUM} ${TAG_CLASS.AS_IS}`}>
          {pill.text}
        </Tag>
      </span>
    </Tooltip>
  );
};

export default InvitePill;
