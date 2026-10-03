import { USERS_CONSTANTS as UC } from '../../../constants';
import { DEFAULT_COLORS, Icons, TIME_FORMATS } from '../../../../../../constants';
import { formatDateTime } from '../../../../../../utils/shared/time';
import RowTag from '../../../../../../components/display/table/RowTag';
import { generateColumn } from '../../../../../../components/display/table/utils';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { User } from '../../../models';
import type { Group } from '../../../../groups/models';
import UserAvatar from '../../../../../../components/display/avatars/UserAvatar';
import { AiOutlineUser, AiOutlineMail, AiOutlineCalendar, AiOutlineLink } from 'react-icons/ai';
import React from 'react';
import { getTotalRoleCount } from '../../../utils';
import BootstrapPill from '../shared/BootstrapPill';
import InvitePill from '../shared/InvitePill';

const RoleIcon = Icons.Role;

const Columns = (ctx: GenerateColumnCtx, groups: Group[] = []) => {
  const cols = [
    generateColumn(
      {
        key: UC.KEYS.USERNAME,
        label: UC.LABELS.COLUMNS.USERNAME,
        align: 'left',
        width: UC.SIZES.COLUMNS.USERNAME,
        render: (_: unknown, record: User) => (
          // width 0 + min-width keeps the pill from widening the column (max-content table).
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: 0,
              minWidth: `max(100%, ${UC.SIZES.COLUMNS.USERNAME}px)`,
            }}
          >
            <UserAvatar avatar={record.avatar} username={record.username} size={32} />
            <span
              title={record.username}
              style={{
                fontWeight: 700,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {record.username}
            </span>
            {record.bootstrap && <BootstrapPill />}
          </div>
        ),
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.FULLNAME,
        label: UC.LABELS.COLUMNS.FULLNAME,
        icon: <AiOutlineUser />,
        width: UC.SIZES.COLUMNS.FULLNAME,
        render: (value: string) => (
          <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{value}</span>
        ),
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.EMAIL,
        label: UC.LABELS.COLUMNS.EMAIL,
        icon: <AiOutlineMail />,
        width: UC.SIZES.COLUMNS.EMAIL,
        render: (value: string) => (
          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{value}</span>
        ),
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.ROLES,
        label: UC.LABELS.COLUMNS.ROLES,
        icon: <RoleIcon />,
        width: UC.SIZES.COLUMNS.ROLE,
        render: (_: unknown, record: User) => {
          const total = getTotalRoleCount(record, groups);
          if (total === 0) {
            return (
              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
                {UC.LABELS.COLUMNS.NO_ROLES}
              </span>
            );
          }
          const text = total === 1 ? '1 role' : `${total} roles`;
          return <RowTag text={text} fontSize={UC.SIZES.CHIP_FONT} />;
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.INVITE,
        label: UC.LABELS.COLUMNS.INVITE,
        icon: <AiOutlineLink />,
        width: UC.SIZES.COLUMNS.INVITE,
        sortable: false,
        render: (_: unknown, record: User) => (
          <InvitePill invite={record.status.invite} acceptedAt={record.status.inviteAcceptedAt} />
        ),
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.CREATION_DATE,
        label: UC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: UC.SIZES.COLUMNS.CREATED,
        render: (value: string) => <span>{formatDateTime(value, TIME_FORMATS.SHORT)}</span>,
      },
      ctx,
    ),
  ];

  return cols;
};

export default Columns;
