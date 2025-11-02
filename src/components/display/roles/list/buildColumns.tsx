import type { Role } from '../../../../interfaces/roles';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import Chip from './Chip';
import ActionsDropdown from './ActionsDropdown';
import { AiOutlineTeam, AiOutlineSafety, AiOutlineCalendar, AiOutlineCheckCircle, AiOutlineTag } from 'react-icons/ai';
import { generateColumn, RolesSortKey } from './utils';

interface BuildColumnsArgs {
  onView: (r: Role) => void;
  onDelete: (r: Role) => void;
  onSort: (key: RolesSortKey) => void;
  activeSortKey: RolesSortKey;
  sortOrder: 'asc' | 'desc';
  getPermissionCount: (r: Role) => number;
}

export const buildColumns = ({ onView, onDelete, onSort, activeSortKey, getPermissionCount }: BuildColumnsArgs) => {
  return [
    generateColumn({
      key: 'name',
      label: RPC.LABELS.COLUMNS.ROLE_TITLE,
      align: 'left',
      width: 320,
      dataIndex: 'name',
      render: (_: string, record: Role) => (
        <span style={{ fontWeight: 700, color: RPC.COLORS.TEXT_PRIMARY }}>{record.name}</span>
      ),
    }, { activeSortKey, onSort }),
    generateColumn({
      key: 'type',
      label: RPC.LABELS.COLUMNS.TYPE,
      icon: <AiOutlineTag />,
      sortableKey: 'type',
      width: 140,
      render: (_: any, record: Role) => (
        <Chip
          text={record.type || RPC.LABELS.CUSTOM_TYPE}
          background={record.type === 'built-in' ? RPC.COLORS.TYPE_BUILTIN_BG : RPC.COLORS.TYPE_CUSTOM_BG}
          color={record.type === 'built-in' ? RPC.COLORS.TYPE_BUILTIN_TEXT : RPC.COLORS.TYPE_CUSTOM_TEXT}
          fontSize={RPC.SIZES.CHIP_FONT}
        />
      ),
    }, { activeSortKey, onSort }),
    generateColumn({
      key: 'group',
      label: RPC.LABELS.COLUMNS.GROUP,
      icon: <AiOutlineTeam />,
      sortableKey: 'group',
      width: 140,
      render: (_: any, record: Role) => (
        <Chip text={record.group} background={RPC.COLORS.CHIP_BLUE_BG} color={RPC.COLORS.CHIP_BLUE_TEXT} fontSize={RPC.SIZES.CHIP_FONT} />
      ),
    }, { activeSortKey, onSort }),
    generateColumn({
      key: 'permission',
      label: RPC.LABELS.COLUMNS.PERMISSIONS,
      icon: <AiOutlineSafety />,
      sortableKey: 'permission',
      width: 160,
      render: (_: any, record: Role) => (
        <Chip
          text={`${getPermissionCount(record)} ${RPC.LABELS.PERMISSIONS_SUFFIX}`}
          background={RPC.COLORS.CHIP_BLUE_BG}
          color={RPC.COLORS.CHIP_BLUE_TEXT}
          fontSize={RPC.SIZES.CHIP_FONT}
        />
      ),
    }, { activeSortKey, onSort }),
    generateColumn({
      key: 'createdAt',
      label: RPC.LABELS.COLUMNS.CREATED,
      icon: <AiOutlineCalendar />,
      sortableKey: 'createdAt',
      width: 160,
      dataIndex: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    }, { activeSortKey, onSort }),
    generateColumn({
      key: 'status',
      label: RPC.LABELS.COLUMNS.STATUS,
      icon: <AiOutlineCheckCircle />,
      sortableKey: 'status',
      width: 120,
      dataIndex: 'status',
      render: (status: string) => (
        <Chip
          text={status}
          background={status === 'Active' ? RPC.COLORS.STATUS_ACTIVE_BG : RPC.COLORS.STATUS_INACTIVE_BG}
          color={status === 'Active' ? RPC.COLORS.STATUS_ACTIVE_TEXT : RPC.COLORS.STATUS_INACTIVE_TEXT}
          fontSize={RPC.SIZES.CHIP_FONT}
        />
      ),
    }, { activeSortKey, onSort }),
    {
      title: '',
      key: 'actions',
      align: 'right' as const,
      width: 48,
      onHeaderCell: () => ({ style: { background: '#fff' } }),
      render: (_: any, record: Role) => <ActionsDropdown record={record} onView={onView} onDelete={onDelete} />,
    },
  ];
};

export type { RolesSortKey };


