import React from 'react';
import { Tag, Tooltip } from 'antd';
import { DEFAULT_COLORS, TAG_CLASS, TIME_FORMATS, getPillColor } from '../../../../../../constants';
import { formatDateTime, toTimestamp } from '../../../../../../utils/shared/time';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { UserInvite, UserStatus } from '../../../models';

const PILL = UC.LABELS.INVITE_PILL;

// Display only: auth enforces the expiry, so a pill that turns late never keeps a link alive.
const isPending = (invite: UserInvite): boolean => toTimestamp(invite.expiresAt) > Date.now();

// An open link outranks the record of an earlier one being used, and that outranks a sign-in without a link (SSO).
export const pillFor = ({
  invite,
  inviteAcceptedAt,
  lastLoginAt,
}: UserStatus): { text: string; accent?: string; tooltip: string } => {
  if (invite) {
    const when = formatDateTime(invite.expiresAt, TIME_FORMATS.DATE_TIME);
    return isPending(invite)
      ? { text: PILL.PENDING, accent: DEFAULT_COLORS.WARNING, tooltip: PILL.EXPIRES_AT(when) }
      : { text: PILL.EXPIRED, accent: DEFAULT_COLORS.WARNING, tooltip: PILL.EXPIRED_AT(when) };
  }
  if (inviteAcceptedAt) {
    const when = formatDateTime(inviteAcceptedAt, TIME_FORMATS.DATE_TIME);
    return { text: PILL.ENROLLED, accent: DEFAULT_COLORS.SUCCESS, tooltip: PILL.ENROLLED_AT(when) };
  }
  if (lastLoginAt) {
    const when = formatDateTime(lastLoginAt, TIME_FORMATS.DATE_TIME);
    return { text: PILL.SIGNED_IN, tooltip: PILL.SIGNED_IN_AT(when) };
  }
  return { text: PILL.NOT_INVITED, tooltip: PILL.NOT_INVITED_TOOLTIP };
};

const InvitePill: React.FC<{ status: UserStatus }> = ({ status }) => {
  const pill = pillFor(status);

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
