import { USERS_CONSTANTS as UC } from '../../../constants';
import { DEFAULT_COLORS, Icons } from '../../../../../../constants';
import { generateColumn } from '../../../../../../components/display/table/utils';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { User } from '../../../models';
import type { Group } from '../../../../groups/models';
import UserAvatar from '../../../../../../components/display/avatars/UserAvatar';
import { AiOutlineUser, AiOutlineMail, AiOutlineCalendar } from 'react-icons/ai';
import React from 'react';
import { getTotalRoleCount } from '../../../utils';

const RoleIcon = Icons.Role;

const ROLE_TAG_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 20,
  padding: '0 8px',
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 500,
  background: `${DEFAULT_COLORS.SUCCESS}18`,
  color: DEFAULT_COLORS.SUCCESS,
  whiteSpace: 'nowrap',
};

const Columns = (ctx: GenerateColumnCtx, groups: Group[] = []) => {
  const cols = [
    generateColumn(
      {
        key: UC.KEYS.USERNAME,
        label: UC.LABELS.COLUMNS.USERNAME,
        align: 'left',
        width: UC.SIZES.COLUMNS.USERNAME,
        render: (_: unknown, record: User) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserAvatar avatar={record.avatar} username={record.username} size={32} />
            <span style={{ fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              {record.username}
            </span>
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
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>—</span>;
          }
          return (
            <span style={ROLE_TAG_STYLE}>
              {total} {total === 1 ? 'Role' : 'Roles'}
            </span>
          );
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.CREATION_DATE,
        label: UC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: UC.SIZES.COLUMNS.CREATED,
        render: (value: string) => <span>{new Date(value).toLocaleDateString()}</span>,
      },
      ctx,
    ),
  ];

  return cols;
};

export default Columns;
