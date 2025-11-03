import React from 'react';
import { ROLE_CATEGORIES_CONSTANTS as RCC } from '../../../constants/pages/roleCategories';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../constants/pages/roles';
import RowTag from '../shared/table/RowTag';
import { generateColumn } from '../shared/table/utils';
import type { GenerateColumnCtx } from '../../../interfaces/table';
import type { RoleCategory } from '../../../interfaces/roles';
import Actions from './Actions';
import { AiOutlineFileText, AiOutlineTeam, AiOutlineTag, AiOutlineCalendar } from 'react-icons/ai';

const Columns = (ctx: GenerateColumnCtx) => {
  const cols: any[] = [];
  cols.push(
    generateColumn(
      {
        key: RCC.KEYS.NAME,
        label: RCC.LABELS.COLUMNS.NAME,
        align: 'left',
        width: RCC.SIZES.COLUMNS.NAME,
        render: (_: any, record: RoleCategory) => (
          <span style={{ fontWeight: 700, color: RPC.COLORS.TEXT_PRIMARY }}>{record.name}</span>
        ),
      },
      ctx,
    ),
  );
  cols.push(
    generateColumn(
      {
        key: RCC.KEYS.DESCRIPTION,
        label: RCC.LABELS.COLUMNS.DESCRIPTION,
        icon: <AiOutlineFileText />,
        width: RCC.SIZES.COLUMNS.DESCRIPTION,
        render: (value: string) => <span style={{ color: RPC.COLORS.TEXT_MUTED }}>{value}</span>,
      },
      ctx,
    ),
  );
  cols.push(
    generateColumn(
      {
        key: RCC.KEYS.USED_BY,
        label: RCC.LABELS.COLUMNS.USED_BY,
        icon: <AiOutlineTeam />,
        width: RCC.SIZES.COLUMNS.USED_BY,
        render: (_: any, record: RoleCategory) => (
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
        key: RCC.KEYS.TYPE,
        label: RCC.LABELS.COLUMNS.TYPE,
        icon: <AiOutlineTag />,
        width: RCC.SIZES.COLUMNS.TYPE,
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
        key: RCC.KEYS.CREATED_AT,
        label: RCC.LABELS.COLUMNS.CREATED,
        icon: <AiOutlineCalendar />,
        width: RCC.SIZES.COLUMNS.CREATED,
        render: (value: string) => <span>{new Date(value).toLocaleDateString()}</span>,
      },
      ctx,
    ),
  );
  cols.push({
    title: '',
    key: RCC.KEYS.ACTIONS,
    align: 'right' as const,
    width: RCC.SIZES.COLUMNS.ACTIONS,
    onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
    render: (_: any, record: RoleCategory) => (
      <Actions record={record} onView={(ctx as any).onView} onDelete={(ctx as any).onDelete} />
    ),
  });
  return cols;
};

export default Columns;


