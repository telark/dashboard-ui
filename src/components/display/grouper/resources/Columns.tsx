import { SyncOutlined } from '@ant-design/icons';
import { AiOutlineTag, AiOutlineCheckCircle } from 'react-icons/ai';
import { ICONS } from '../../../../constants';
import { generateColumn } from '../../shared/table/utils';
import RowTag from '../../shared/table/RowTag';
import TimeAgo from '../../../time/TimeAgo';
import { ParseGoTimeDate } from '../../../../utils/shared/time';
import type { ResourceRowInterface } from '../../../../interfaces/shared';
import { UI, DEFAULT_COLORS } from '../../../../constants';

const WorkloadIcon = ICONS.WORKLOAD;
const BridgeIcon = ICONS.BRIDGE;

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
          const isBridge = (record.type || '').toLowerCase() === 'bridge';
          const isSyncing = isResourceSyncing(record.name, record.type, record);

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(32,201,151,0.12)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: DEFAULT_COLORS.SUCCESS,
                  flexShrink: 0,
                }}
              >
                {isBridge ? (
                  <BridgeIcon style={{ fontSize: 16 }} />
                ) : (
                  <WorkloadIcon style={{ fontSize: 16 }} />
                )}
              </div>
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
          return (
            <RowTag
              text={resourceKind}
              background="#F9FAFB"
              color="#111827"
              fontSize={12}
            />
          );
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
        render: (status: string) => (
          <RowTag
            text={status || '—'}
            background={status === 'Available' ? '#D1FAE5' : '#F3F4F6'}
            color={status === 'Available' ? '#065F46' : '#6B7280'}
            fontSize={12}
          />
        ),
      },
      { activeSortKey: '', onSort: () => {} },
    ),
  ];
};

