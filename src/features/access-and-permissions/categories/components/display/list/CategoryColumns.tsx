import type { TableColumnType } from 'antd';
import { ROLES_CONSTANTS as RPC } from '../../../../roles/constants';
import RowTag from '../../../../../../components/display/table/RowTag';
import { generateColumn } from '../../../../../../components/display/table/utils';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { Category } from '../../../models';
import { AiOutlineTag, AiOutlineCalendar, AiOutlineAppstore } from 'react-icons/ai';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { CATEGORIES_CONSTANTS as CC } from '../../../constants';
import { EMPTY_VALUE } from '../../../../shared';

interface CategoryColumnsContext extends GenerateColumnCtx {
  onView?: (record: Category) => void;
  onEdit?: (record: Category) => void;
  onDelete?: (record: Category) => void;
}

const CategoryColumns = (ctx: CategoryColumnsContext) => {
  const cols: TableColumnType<Category>[] = [];

  cols.push(
    generateColumn(
      {
        key: CC.KEYS.NAME,
        label: CC.LABELS.COLUMNS.NAME,
        align: 'left',
        width: CC.SIZES.COLUMNS.NAME,
        render: (_: unknown, record: Category) => (
          <span
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
              display: 'inline-block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
            title={record.name}
          >
            {record.name}
          </span>
        ),
      },
      ctx,
    ),
    generateColumn(
      {
        key: CC.KEYS.TYPE,
        label: CC.LABELS.COLUMNS.TYPE,
        icon: <AiOutlineAppstore />,
        width: CC.SIZES.COLUMNS.TYPE,
        render: (value: string) => {
          const isBuiltIn = value === CC.TYPES.BUILT_IN;
          return <RowTag text={isBuiltIn ? 'Built-in' : 'Custom'} fontSize={RPC.SIZES.CHIP_FONT} />;
        },
      },
      ctx,
    ),
    generateColumn(
      {
        key: CC.KEYS.SCOPE,
        label: CC.LABELS.COLUMNS.SCOPE,
        icon: <AiOutlineTag />,
        width: CC.SIZES.COLUMNS.SCOPE,
        render: (value: string) => <RowTag text={value} fontSize={RPC.SIZES.CHIP_FONT} />,
      },
      ctx,
    ),
    generateColumn(
      {
        key: CC.KEYS.CREATED_AT,
        label: CC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: CC.SIZES.COLUMNS.CREATED,
        render: (value: string) => {
          if (!value)
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>;
          try {
            return <TimeAgo date={value} />;
          } catch {
            return <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{EMPTY_VALUE}</span>;
          }
        },
      },
      ctx,
    ),
  );

  return cols;
};

export default CategoryColumns;
