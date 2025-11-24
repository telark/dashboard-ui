import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { ROLES_CONSTANTS as RPC } from '../../../../roles/constants';
import RowTag from '../../../../../../components/display/shared/table/RowTag';
import { generateColumn } from '../../../../../../components/display/shared/table/utils';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { Group } from '../../../models';
import Actions from './Actions';
import { AiOutlineFileText, AiOutlineTag, AiOutlineCalendar } from 'react-icons/ai';

const Columns = (ctx: GenerateColumnCtx) => {
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
        render: (value: string) => <span style={{ color: RPC.COLORS.TEXT_MUTED }}>{value}</span>,
      },
      ctx,
    ),
    generateColumn(
      {
        key: GC.KEYS.CATEGORY,
        label: GC.LABELS.COLUMNS.CATEGORY,
        icon: <AiOutlineTag />,
        width: GC.SIZES.COLUMNS.CATEGORY,
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
    generateColumn(
      {
        key: GC.KEYS.CREATED_AT,
        label: GC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: GC.SIZES.COLUMNS.CREATED,
        render: (value: string) => <span>{new Date(value).toLocaleDateString()}</span>,
      },
      ctx,
    ),
    {
      title: '',
      key: GC.KEYS.ACTIONS,
      align: 'right' as const,
      width: GC.SIZES.COLUMNS.ACTIONS,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (_: any, record: Group) => (
        <Actions
          record={record}
          onView={(ctx as any).onView}
          onEdit={(ctx as any).onEdit}
          onDelete={(ctx as any).onDelete}
        />
      ),
    },
  );
  return cols;
};

export default Columns;
