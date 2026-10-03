import type { TableColumnType } from 'antd';
import type { Role, ColumnsArgs } from '../../../models';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { generateColumn } from '../../../../../../components/display/table/utils';
import { ACTORS, DEFAULT_COLORS } from '../../../../../../constants';
import {
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineTag,
  AiOutlineClockCircle,
  AiOutlineHourglass,
  AiOutlineFolder,
  AiOutlineCode,
} from 'react-icons/ai';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import { getCategoryName } from '../../../../categories/utils/helpers';
import { ActorDisplay } from '../../../../../../components/display/users';
import { AiOutlineUser } from 'react-icons/ai';
import { ValidityDisplay } from '../../../../../../components/display/validity';
import { EMPTY_VALUE } from '../../../../shared';

export const Columns = ({
  onSort,
  activeSortKey,
  categories = [],
  users = [],
  usernamesById = {},
}: Omit<ColumnsArgs, 'onView' | 'onEdit' | 'onDelete'>): TableColumnType<Role>[] => {
  const isBuiltIn = (record: Role) => record.type === RPC.TYPE.BUILT_IN;

  const getUserById = (userId?: string) => {
    if (!userId) return null;
    return users.find((u) => u.id === userId) || null;
  };
  return [
    generateColumn(
      {
        key: RPC.KEYS.NAME,
        label: RPC.LABELS.COLUMNS.ROLE_TITLE,
        align: 'left',
        width: RPC.SIZES.COLUMNS.ROLE_TITLE,
        render: (_: string, record: Role) => (
          <span style={{ fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>{record.name}</span>
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.TYPE,
        label: RPC.LABELS.COLUMNS.TYPE,
        icon: <AiOutlineTag />,
        width: RPC.SIZES.COLUMNS.TYPE,
        render: (_: unknown, record: Role) => (
          <RowTag text={record.type ?? RPC.LABELS.CUSTOM_TYPE} fontSize={RPC.SIZES.CHIP_FONT} />
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.STATUS,
        label: RPC.LABELS.COLUMNS.STATUS,
        icon: <AiOutlineCheckCircle />,
        width: RPC.SIZES.COLUMNS.STATUS,
        render: (status: string) => <RowTag text={status} fontSize={RPC.SIZES.CHIP_FONT} />,
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.CREATED_AT,
        label: RPC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: RPC.SIZES.COLUMNS.CREATED,
        render: (_: unknown, record: Role) => {
          if (isBuiltIn(record))
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>;
          return <TimeAgo date={record.creationDate} />;
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.CREATED_BY,
        label: RPC.LABELS.COLUMNS.CREATED_BY,
        icon: <AiOutlineUser />,
        width: RPC.SIZES.COLUMNS.CREATED_BY,
        render: (_: unknown, record: Role) => {
          if (isBuiltIn(record))
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{ACTORS.NONE}</span>;
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ActorDisplay
                actor={record.createdBy}
                user={getUserById(record.createdBy)}
                usernamesById={usernamesById}
                size="small"
              />
            </div>
          );
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.LAST_UPDATE,
        label: RPC.LABELS.COLUMNS.LAST_UPDATE,
        icon: <AiOutlineClockCircle />,
        width: RPC.SIZES.COLUMNS.LAST_UPDATE,
        render: (_: unknown, record: Role) => {
          if (isBuiltIn(record) || !record.lastUpdateDate) {
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>;
          }
          return <TimeAgo date={record.lastUpdateDate} />;
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.VALIDITY,
        label: RPC.LABELS.COLUMNS.VALIDITY,
        icon: <AiOutlineHourglass />,
        width: RPC.SIZES.COLUMNS.VALIDITY,
        render: (_: unknown, record: Role) => {
          if (isBuiltIn(record))
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>;
          return (
            <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              <ValidityDisplay validity={record.validity} record={record} />
            </span>
          );
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.CATEGORY,
        label: RPC.LABELS.COLUMNS.CATEGORY,
        icon: <AiOutlineFolder />,
        width: RPC.SIZES.COLUMNS.CATEGORY,
        render: (_: unknown, record: Role) => {
          if (isBuiltIn(record))
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>;
          const categoryName = getCategoryName(record.categoryRef, categories);
          return <RowTag text={categoryName} fontSize={RPC.SIZES.CHIP_FONT} />;
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.VERSION,
        label: RPC.LABELS.COLUMNS.VERSION,
        icon: <AiOutlineCode />,
        width: RPC.SIZES.COLUMNS.VERSION,
        render: (_: unknown, record: Role) => {
          if (isBuiltIn(record))
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>;
          return <RowTag text={record.version || EMPTY_VALUE} fontSize={RPC.SIZES.CHIP_FONT} />;
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
  ];
};
