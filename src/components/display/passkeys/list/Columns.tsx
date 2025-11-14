import type { Passkey } from '../../../../interfaces/passkeys';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants/pages/passkeys';
import RowTag from '../../shared/table/RowTag';
import { generateColumn } from '../../shared/table/utils';
import Actions from './Actions';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { BsKey } from 'react-icons/bs';
import TimeAgo from '../../../../components/time/TimeAgo';
import type { PasskeysSortKey } from './utils';

interface ColumnsArgs {
  onView: (r: Passkey) => void;
  onEdit?: (r: Passkey) => void;
  onDelete: (r: Passkey) => void;
  onSort: (key: PasskeysSortKey) => void;
  activeSortKey: PasskeysSortKey;
  sortOrder: 'asc' | 'desc';
}

export const Columns = ({ onView, onEdit, onDelete, onSort, activeSortKey }: ColumnsArgs) => {
  return [
    generateColumn(
      {
        key: PPC.KEYS.DEVICE_NAME,
        label: PPC.LABELS.COLUMNS.DEVICE_NAME,
        align: 'left',
        width: PPC.SIZES.COLUMNS.DEVICE_NAME,
        render: (_: string, record: Passkey) => (
          <span style={{ fontWeight: 700, color: PPC.COLORS.TEXT_PRIMARY }}>
            {record.deviceName}
          </span>
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: PPC.KEYS.DEVICE_TYPE,
        label: PPC.LABELS.COLUMNS.DEVICE_TYPE,
        icon: <BsKey />,
        width: PPC.SIZES.COLUMNS.DEVICE_TYPE,
        render: (_: any, record: Passkey) => (
          <RowTag
            text={
              record.deviceType === PPC.VALUES.DEVICE_TYPE_PLATFORM
                ? PPC.LABELS.DEVICE_TYPE_PLATFORM
                : PPC.LABELS.DEVICE_TYPE_CROSS_PLATFORM
            }
            background={
              record.deviceType === PPC.VALUES.DEVICE_TYPE_PLATFORM
                ? PPC.COLORS.CHIP_PLATFORM_BG
                : PPC.COLORS.CHIP_CROSS_PLATFORM_BG
            }
            color={
              record.deviceType === PPC.VALUES.DEVICE_TYPE_PLATFORM
                ? PPC.COLORS.CHIP_PLATFORM_TEXT
                : PPC.COLORS.CHIP_CROSS_PLATFORM_TEXT
            }
            fontSize={PPC.SIZES.CHIP_FONT}
          />
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: PPC.KEYS.CREATED_AT,
        label: PPC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: PPC.SIZES.COLUMNS.CREATED,
        render: (_: any, record: Passkey) =>
          record.creationTimestamp ? (
            <TimeAgo date={record.creationTimestamp} />
          ) : (
            <span style={{ color: '#999' }}>{PPC.LABELS.NEVER_USED}</span>
          ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: PPC.KEYS.LAST_USED_AT,
        label: PPC.LABELS.COLUMNS.LAST_USED,
        icon: <AiOutlineClockCircle />,
        width: PPC.SIZES.COLUMNS.LAST_USED,
        render: (_: any, record: Passkey) =>
          record.lastUsedTimestamp ? (
            <TimeAgo date={record.lastUsedTimestamp} />
          ) : (
            <span style={{ color: '#999' }}>{PPC.LABELS.NEVER_USED}</span>
          ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    {
      title: '',
      key: PPC.KEYS.ACTIONS,
      align: 'right' as const,
      width: 48,
      onHeaderCell: () => ({ style: { background: PPC.COLORS.HEADER_BG } }),
      render: (_: any, record: Passkey) => (
        <Actions record={record} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
};

export type { PasskeysSortKey } from './utils';
