import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { ROLES_CONSTANTS as RPC } from '../../../../roles/constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { generateColumn } from '../../../../../../components/display/table/utils';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { Group } from '../../../models';
import {
  AiOutlineFileText,
  AiOutlineTag,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineTeam,
} from 'react-icons/ai';
import type { Category } from '../../../../categories/models';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import { getCategoryName } from '../../../../categories/utils';
import { UserDisplay } from '../../../../../../components/display/users';
import type { User } from '../../../../users/models';

interface ColumnsContext extends GenerateColumnCtx {
  categories?: Category[];
  users?: User[];
  onView?: (record: Group) => void;
  onEdit?: (record: Group) => void;
  onDelete?: (record: Group) => void;
}

const DESCRIPTION_PREVIEW_MAX = 40;

const Columns = (ctx: ColumnsContext) => {
  const categories = ctx.categories || [];
  const users = ctx.users || [];

  const getUserById = (userId?: string) => {
    if (!userId) return null;
    return users.find((u) => u.id === userId) || null;
  };

  const cols: any[] = [];
  cols.push(
    generateColumn(
      {
        key: GC.KEYS.NAME,
        label: GC.LABELS.COLUMNS.NAME,
        align: 'left',
        width: GC.SIZES.COLUMNS.NAME,
        render: (_: any, record: Group) => (
          <span style={{ fontWeight: 700, color: RPC.COLORS.TEXT_PRIMARY }}>{record.name}</span>
        ),
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.DESCRIPTION,
        label: GC.LABELS.COLUMNS.DESCRIPTION,
        icon: <AiOutlineFileText />,
        width: GC.SIZES.COLUMNS.DESCRIPTION,
        render: (value: string) => {
          const text = value || '';
          const truncated = text.length > DESCRIPTION_PREVIEW_MAX ? `${text.slice(0, DESCRIPTION_PREVIEW_MAX)}...` : text;
          return <span style={{ color: RPC.COLORS.TEXT_MUTED }}>{truncated}</span>;
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.CATEGORY,
        label: GC.LABELS.COLUMNS.CATEGORY,
        icon: <AiOutlineTag />,
        width: GC.SIZES.COLUMNS.CATEGORY,
        render: (value: string) => {
          const categoryName = getCategoryName(value, categories);
          return (
            <RowTag
              text={categoryName}
              background={RPC.COLORS.TYPE_CUSTOM_BG}
              color={RPC.COLORS.TYPE_CUSTOM_TEXT}
              fontSize={RPC.SIZES.CHIP_FONT}
            />
          );
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.MEMBERS,
        label: GC.LABELS.COLUMNS.MEMBERS,
        icon: <AiOutlineTeam />,
        width: GC.SIZES.COLUMNS.MEMBERS,
        render: (_: unknown, record: Group) => {
          const memberCount = record.assignedUsersIDs?.length || 0;
          const memberText = memberCount === 1 ? '1 member' : `${memberCount} members`;
          return (
            <RowTag
              text={memberText}
              background={RPC.COLORS.TYPE_CUSTOM_BG}
              color={RPC.COLORS.TYPE_CUSTOM_TEXT}
              fontSize={RPC.SIZES.CHIP_FONT}
            />
          );
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.CREATED_AT,
        label: GC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: GC.SIZES.COLUMNS.CREATED,
        render: (value: string) => {
          if (!value) return <span style={{ color: RPC.COLORS.TEXT_MUTED }}>—</span>;
          try {
            return <TimeAgo date={value} />;
          } catch {
            return <span style={{ color: RPC.COLORS.TEXT_MUTED }}>—</span>;
          }
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.LAST_UPDATE,
        label: GC.LABELS.COLUMNS.LAST_UPDATE,
        icon: <AiOutlineClockCircle />,
        width: GC.SIZES.COLUMNS.LAST_UPDATE,
        render: (_: unknown, record: Group) => {
          if (!record.lastUpdateDate) {
            return <span style={{ color: RPC.COLORS.TEXT_MUTED }}>—</span>;
          }
          return <TimeAgo date={record.lastUpdateDate} />;
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.CREATED_BY,
        label: GC.LABELS.COLUMNS.CREATED_BY,
        icon: <AiOutlineUser />,
        width: GC.SIZES.COLUMNS.CREATED_BY,
        render: (_: unknown, record: Group) => {
          const user = getUserById(record.createdBy);
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <UserDisplay user={user} size="small" />
            </div>
          );
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.LAST_UPDATED_BY,
        label: GC.LABELS.COLUMNS.LAST_UPDATED_BY,
        icon: <AiOutlineUser />,
        width: GC.SIZES.COLUMNS.LAST_UPDATED_BY,
        render: (_: unknown, record: Group) => {
          const user = getUserById(record.lastUpdatedBy);
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <UserDisplay user={user} size="small" />
            </div>
          );
        },
      },
      ctx,
    ),
  );
  return cols;
};

export default Columns;
