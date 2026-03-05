import { USERS_CONSTANTS as UC } from '../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { generateColumn } from '../../../../../../components/display/table/utils';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { User } from '../../../models';
import UserAvatar from '../../../../../../components/display/avatars/UserAvatar';
import { AiOutlineUser, AiOutlineMail, AiOutlineTag, AiOutlineCalendar } from 'react-icons/ai';
import React from 'react';

const Columns = (ctx: GenerateColumnCtx) => {
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
        icon: <AiOutlineTag />,
        width: UC.SIZES.COLUMNS.ROLE,
        render: (_: unknown, record: User) => {
          const roles = record.assignedRolesIDs || [];
          if (roles.length === 0) {
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>—</span>;
          }
          return (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {roles.slice(0, 2).map((roleId) => (
                <RowTag
                  key={roleId}
                  text={roleId}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                  fontSize={UC.SIZES.CHIP_FONT}
                />
              ))}
              {roles.length > 2 && (
                <RowTag
                  text={`+${roles.length - 2}`}
                  background={DEFAULT_COLORS.BACKGROUND_HOVER}
                  color={DEFAULT_COLORS.TEXT_MUTED}
                  fontSize={UC.SIZES.CHIP_FONT}
                />
              )}
            </div>
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
