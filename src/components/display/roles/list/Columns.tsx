import type { Role } from '../../../../interfaces/resources/roles';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import RowTag from '../../shared/table/RowTag';
import { generateColumn } from '../../shared/table/utils';
import Actions from './Actions';
import { AiOutlineCalendar, AiOutlineCheckCircle, AiOutlineTag } from 'react-icons/ai';
import { ICONS } from '../../../../constants';
import type { RolesSortKey } from './utils';

const RoleIcon = ICONS.ROLE;

interface ColumnsArgs {
  onView: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete: (r: Role) => void;
  onSort: (key: RolesSortKey) => void;
  activeSortKey: RolesSortKey;
  sortOrder: 'asc' | 'desc';
  getPermissionCount: (r: Role) => number;
}

export const Columns = ({
  onView,
  onEdit,
  onDelete,
  onSort,
  activeSortKey,
  getPermissionCount,
}: ColumnsArgs) => {
  return [
    generateColumn(
      {
        key: RPC.KEYS.NAME,
        label: RPC.LABELS.COLUMNS.ROLE_TITLE,
        align: 'left',
        width: RPC.SIZES.COLUMNS.ROLE_TITLE,
        render: (_: string, record: Role) => (
          <span style={{ fontWeight: 700, color: RPC.COLORS.TEXT_PRIMARY }}>{record.name}</span>
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
        render: (_: any, record: Role) => (
          <RowTag
            text={record.type || RPC.LABELS.CUSTOM_TYPE}
            background={
              record.type === RPC.TYPE.BUILT_IN
                ? RPC.COLORS.TYPE_BUILTIN_BG
                : RPC.COLORS.TYPE_CUSTOM_BG
            }
            color={
              record.type === RPC.TYPE.BUILT_IN
                ? RPC.COLORS.TYPE_BUILTIN_TEXT
                : RPC.COLORS.TYPE_CUSTOM_TEXT
            }
            fontSize={RPC.SIZES.CHIP_FONT}
          />
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.PERMISSION,
        label: RPC.LABELS.COLUMNS.PERMISSIONS,
        icon: <RoleIcon />,
        width: RPC.SIZES.COLUMNS.PERMISSIONS,
        render: (_: any, record: Role) => (
          <RowTag
            text={`${getPermissionCount(record)} ${RPC.LABELS.PERMISSIONS_SUFFIX}`}
            background={RPC.COLORS.CHIP_BLUE_BG}
            color={RPC.COLORS.CHIP_BLUE_TEXT}
            fontSize={RPC.SIZES.CHIP_FONT}
          />
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
        render: (status: string) => (
          <RowTag
            text={status}
            background={
              status === RPC.LABELS.STATUS_ACTIVE
                ? RPC.COLORS.STATUS_ACTIVE_BG
                : RPC.COLORS.STATUS_INACTIVE_BG
            }
            color={
              status === RPC.LABELS.STATUS_ACTIVE
                ? RPC.COLORS.STATUS_ACTIVE_TEXT
                : RPC.COLORS.STATUS_INACTIVE_TEXT
            }
            fontSize={RPC.SIZES.CHIP_FONT}
          />
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: RPC.KEYS.CREATED_AT,
        label: RPC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: RPC.SIZES.COLUMNS.CREATED,
        render: (date: string) =>
          new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    {
      title: '',
      key: RPC.KEYS.ACTIONS,
      align: 'right' as const,
      width: 48,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (_: any, record: Role) => (
        <Actions record={record} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
};

export type { RolesSortKey } from './utils';
