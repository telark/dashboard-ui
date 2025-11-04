import { CATEGORIES_CONSTANTS as CC } from '../../../constants/pages/categories';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../constants/pages/roles';
import RowTag from '../shared/table/RowTag';
import { generateColumn } from '../shared/table/utils';
import type { GenerateColumnCtx } from '../../../interfaces/table';
import type { Category } from '../../../interfaces/categories';
import Actions from './Actions';
import { AiOutlineFileText, AiOutlineTeam, AiOutlineTag, AiOutlineCalendar } from 'react-icons/ai';

const Columns = (ctx: GenerateColumnCtx) => {
  const cols: any[] = [];
  cols.push(
    generateColumn(
      {
        key: CC.KEYS.NAME,
        label: CC.LABELS.COLUMNS.NAME,
        align: 'left',
        width: CC.SIZES.COLUMNS.NAME,
        render: (_: any, record: Category) => (
          <span style={{ fontWeight: 700, color: RPC.COLORS.TEXT_PRIMARY }}>{record.name}</span>
        ),
      },
      ctx,
    ),
  );
  cols.push(
    generateColumn(
      {
        key: CC.KEYS.DESCRIPTION,
        label: CC.LABELS.COLUMNS.DESCRIPTION,
        icon: <AiOutlineFileText />,
        width: CC.SIZES.COLUMNS.DESCRIPTION,
        render: (value: string) => <span style={{ color: RPC.COLORS.TEXT_MUTED }}>{value}</span>,
      },
      ctx,
    ),
  );
  cols.push(
    generateColumn(
      {
        key: CC.KEYS.USED_BY,
        label: CC.LABELS.COLUMNS.USED_BY,
        icon: <AiOutlineTeam />,
        width: CC.SIZES.COLUMNS.USED_BY,
        render: (_: any, record: Category) => (
          <RowTag
            text={`${record.usedBy?.length ?? 0}`}
            background={RPC.COLORS.CHIP_BLUE_BG}
            color={RPC.COLORS.CHIP_BLUE_TEXT}
            fontSize={RPC.SIZES.CHIP_FONT}
          />
        ),
      },
      ctx,
    ),
  );
  cols.push(
    generateColumn(
      {
        key: CC.KEYS.TYPE,
        label: CC.LABELS.COLUMNS.TYPE,
        icon: <AiOutlineTag />,
        width: CC.SIZES.COLUMNS.TYPE,
        render: (value: string) => (
          <RowTag
            text={value}
            background={RPC.COLORS.TYPE_CUSTOM_BG}
            color={RPC.COLORS.TYPE_CUSTOM_TEXT}
            fontSize={RPC.SIZES.CHIP_FONT}
          />
        ),
      },
      ctx,
    ),
  );
  cols.push(
    generateColumn(
      {
        key: CC.KEYS.CREATED_AT,
        label: CC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: CC.SIZES.COLUMNS.CREATED,
        render: (value: string) => <span>{new Date(value).toLocaleDateString()}</span>,
      },
      ctx,
    ),
  );
  cols.push({
    title: '',
    key: CC.KEYS.ACTIONS,
    align: 'right' as const,
    width: CC.SIZES.COLUMNS.ACTIONS,
    onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
    render: (_: any, record: Category) => (
      <Actions record={record} onView={(ctx as any).onView} onDelete={(ctx as any).onDelete} />
    ),
  });
  return cols;
};

export default Columns;
