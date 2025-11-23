import { SyncOutlined } from '@ant-design/icons';
import { AiOutlineTag, AiOutlineCheckCircle, AiOutlineCalendar } from 'react-icons/ai';
import { generateColumn } from '../../../../../components/display/shared/table/utils';
import RowTag from '../../../../../components/display/shared/table/RowTag';
import TimeAgo from '../../../../../components/time/TimeAgo';
import { ParseGoTimeDate } from '../../../../../utils/shared/time';
import type { ResourceRowInterface } from '../../../../../interfaces/shared';
import { UI, DEFAULT_COLORS } from '../../../../../constants';

interface ColumnsArgs {
  isResourceSyncing: (
    resourceName: string,
    resourceType: string,
    resource?: ResourceRowInterface,
  ) => boolean;
}

export const Columns = ({ isResourceSyncing }: ColumnsArgs) => {
  return [
    generateColumn(
      {
        key: 'name',
        label: UI.RESOURCES.LABELS.NAME,
        align: 'left',
        width: 300,
        render: (_: string, record: ResourceRowInterface) => {
          const displayName = record.sourceName || record.name;
          const isSyncing = isResourceSyncing(record.name, record.type, record);

          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: '#0B1F33',
                  fontSize: 14,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: isSyncing ? DEFAULT_COLORS.SUCCESS : '#5B6B7C',
                  fontSize: 12,
                }}
              >
                <SyncOutlined spin={isSyncing} style={{ fontSize: 12 }} />
                <TimeAgo date={ParseGoTimeDate(record.lastSync)} />
              </div>
            </div>
          );
        },
      },
      { activeSortKey: '', onSort: () => {} },
    ),
    generateColumn(
      {
        key: 'type',
        label: UI.RESOURCES.LABELS.KIND,
        icon: <AiOutlineTag />,
        width: 200,
        render: (_: any, record: ResourceRowInterface) => {
          const resourceKind = record.sourceType || record.type || '—';
          return <RowTag text={resourceKind} background="#F9FAFB" color="#111827" fontSize={12} />;
        },
      },
      { activeSortKey: '', onSort: () => {} },
    ),
    generateColumn(
      {
        key: 'status',
        label: UI.RESOURCES.LABELS.STATUS,
        icon: <AiOutlineCheckCircle />,
        width: 150,
        render: (_: any, record: ResourceRowInterface) => {
          const status = record.status || '—';
          const isActive = status === 'Available' || status === 'Active';
          return (
            <RowTag
              text={status}
              background={isActive ? '#D1FAE5' : '#F3F4F6'}
              color={isActive ? '#065F46' : '#6B7280'}
              fontSize={12}
            />
          );
        },
      },
      { activeSortKey: '', onSort: () => {} },
    ),
    generateColumn(
      {
        key: 'creationTime',
        label: 'Creation Date',
        icon: <AiOutlineCalendar />,
        width: 200,
        render: (_: any, record: ResourceRowInterface) => {
          if (!record.creationTime) return <span style={{ color: '#999' }}>—</span>;
          return <TimeAgo date={ParseGoTimeDate(record.creationTime)} />;
        },
      },
      { activeSortKey: '', onSort: () => {} },
    ),
  ];
};
