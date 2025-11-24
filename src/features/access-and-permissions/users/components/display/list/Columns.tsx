import { USERS_CONSTANTS as UC } from '../../../constants';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../../../constants/pages/roles';
import RowTag from '../../../../../../components/display/shared/table/RowTag';
import { generateColumn } from '../../../../../../components/display/shared/table/utils';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { User } from '../../../models';
import Actions from './Actions';
import UserAvatar from '../../../../../../components/display/shared/avatars/UserAvatar';
import { AiOutlineUser, AiOutlineMail, AiOutlineTag, AiOutlineCalendar } from 'react-icons/ai';

const Columns = (ctx: GenerateColumnCtx) => {
  const cols: any[] = [];
  cols.push(
    generateColumn(
      {
        key: UC.KEYS.USERNAME,
        label: UC.LABELS.COLUMNS.USERNAME,
        align: 'left',
        width: UC.SIZES.COLUMNS.USERNAME,
        render: (_: any, record: User) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserAvatar avatar={record.avatar} username={record.username} size={32} />
            <span style={{ fontWeight: 700, color: RPC.COLORS.TEXT_PRIMARY }}>
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
        render: (value: string) => <span style={{ color: RPC.COLORS.TEXT_PRIMARY }}>{value}</span>,
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.EMAIL,
        label: UC.LABELS.COLUMNS.EMAIL,
        icon: <AiOutlineMail />,
        width: UC.SIZES.COLUMNS.EMAIL,
        render: (value: string) => <span style={{ color: RPC.COLORS.TEXT_MUTED }}>{value}</span>,
      },
      ctx,
    ),
    generateColumn(
      {
        key: UC.KEYS.ROLE,
        label: UC.LABELS.COLUMNS.ROLE,
        icon: <AiOutlineTag />,
        width: UC.SIZES.COLUMNS.ROLE,
        render: (_: any, record: User) => (
          <RowTag
            text={record.roleID}
            background={RPC.COLORS.TYPE_CUSTOM_BG}
            color={RPC.COLORS.TYPE_CUSTOM_TEXT}
            fontSize={RPC.SIZES.CHIP_FONT}
          />
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
        render: (value: string) => <span>{new Date(value).toLocaleDateString()}</span>,
      },
      ctx,
    ),
    {
      title: '',
      key: UC.KEYS.ACTIONS,
      align: 'right' as const,
      width: UC.SIZES.COLUMNS.ACTIONS,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (_: any, record: User) => (
        <Actions
          record={record}
          onView={(ctx as any).onView}
          onEdit={(ctx as any).onEdit}
          onDelete={(ctx as any).onDelete}
        />
      ),
    },
  );
  return cols;
};

export default Columns;
