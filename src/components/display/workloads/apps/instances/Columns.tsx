import type { InstanceTableRow } from '../../../../../interfaces/instances';
import { INSTANCES_PAGE_CONSTANTS as IPC } from '../../../../../constants/pages/instances';
import RowTag from '../../../shared/table/RowTag';
import { generateColumn } from '../../../shared/table/utils';
import {
  AiOutlineCheckCircle,
  AiOutlineAppstore,
  AiOutlineDatabase,
  AiOutlineContainer,
  AiOutlineFileImage,
  AiOutlineTag,
} from 'react-icons/ai';
import type { InstancesSortKey } from './utils';

interface ColumnsArgs {
  onSort: (key: InstancesSortKey) => void;
  activeSortKey: InstancesSortKey;
  sortOrder: 'asc' | 'desc';
}

export const Columns = ({ onSort, activeSortKey }: ColumnsArgs) => {
  const getStatusColor = (status: string) => {
    const isActive = /active|ready|running|available/i.test(status);
    return {
      background: isActive ? IPC.COLORS.STATUS_ACTIVE_BG : IPC.COLORS.STATUS_INACTIVE_BG,
      color: isActive ? IPC.COLORS.STATUS_ACTIVE_TEXT : IPC.COLORS.STATUS_INACTIVE_TEXT,
    };
  };

  return [
    generateColumn(
      {
        key: IPC.KEYS.INSTANCE_NAME,
        label: IPC.LABELS.COLUMNS.INSTANCE_NAME,
        align: 'left',
        width: IPC.SIZES.COLUMNS.INSTANCE_NAME,
        render: (_: string, record: InstanceTableRow) => (
          <span style={{ fontWeight: 700, color: IPC.COLORS.TEXT_PRIMARY }}>
            {record.instanceName}
          </span>
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: IPC.KEYS.STATUS,
        label: IPC.LABELS.COLUMNS.STATUS,
        icon: <AiOutlineCheckCircle />,
        width: IPC.SIZES.COLUMNS.STATUS,
        render: (status: string) => {
          const colors = getStatusColor(status);
          return (
            <RowTag
              text={status}
              background={colors.background}
              color={colors.color}
              fontSize={IPC.SIZES.CHIP_FONT}
            />
          );
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: IPC.KEYS.CPU,
        label: IPC.LABELS.COLUMNS.CPU,
        icon: <AiOutlineAppstore />,
        width: IPC.SIZES.COLUMNS.CPU,
        render: (cpu: string) => (
          <span style={{ color: IPC.COLORS.TEXT_PRIMARY }}>{cpu}</span>
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: IPC.KEYS.MEMORY,
        label: IPC.LABELS.COLUMNS.MEMORY,
        icon: <AiOutlineDatabase />,
        width: IPC.SIZES.COLUMNS.MEMORY,
        render: (memory: string) => (
          <span style={{ color: IPC.COLORS.TEXT_PRIMARY }}>{memory}</span>
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: IPC.KEYS.CONTAINERS,
        label: IPC.LABELS.COLUMNS.CONTAINERS,
        icon: <AiOutlineContainer />,
        width: IPC.SIZES.COLUMNS.CONTAINERS,
        render: (_: number, record: InstanceTableRow) => {
          const containerNames = record.containerNames?.split(', ').filter(Boolean) || [];
          if (containerNames.length === 0) {
            return <span style={{ color: IPC.COLORS.TEXT_MUTED }}>N/A</span>;
          }
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
              {containerNames.map((name: string, index: number) => (
                <RowTag
                  key={index}
                  text={name}
                  background={IPC.COLORS.CHIP_BLUE_BG}
                  color={IPC.COLORS.CHIP_BLUE_TEXT}
                  fontSize={IPC.SIZES.CHIP_FONT}
                />
              ))}
            </div>
          );
        },
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: IPC.KEYS.IMAGE_NAME,
        label: IPC.LABELS.COLUMNS.IMAGE_NAME,
        icon: <AiOutlineFileImage />,
        width: IPC.SIZES.COLUMNS.IMAGE_NAME,
        render: (name: string) => (
          <span style={{ color: IPC.COLORS.TEXT_PRIMARY }}>{name}</span>
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
    generateColumn(
      {
        key: IPC.KEYS.IMAGE_VERSION,
        label: IPC.LABELS.COLUMNS.IMAGE_VERSION,
        icon: <AiOutlineTag />,
        width: IPC.SIZES.COLUMNS.IMAGE_VERSION,
        render: (version: string) => (
          <span style={{ color: IPC.COLORS.TEXT_PRIMARY }}>{version}</span>
        ),
      },
      { activeSortKey: activeSortKey as string, onSort: onSort as (key: string) => void },
    ),
  ];
};

export type { InstancesSortKey };

