import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants/pages/passkeys';
import type { Passkey } from '../../../../interfaces/auth';
import { Columns } from './Columns';
import { PasskeysSortKey, sortPasskeys } from './utils';
import DataTable from '../../shared/table/DataTable';

interface PasskeysTableProps {
  passkeys: Passkey[];
  onPasskeysChange?: (passkeys: Passkey[]) => void;
  onView?: (passkey: Passkey) => void;
  onEdit?: (passkey: Passkey) => void;
  onDelete?: (passkey: Passkey) => void;
}

const PasskeysTable: React.FC<PasskeysTableProps> = ({
  passkeys,
  onPasskeysChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const [sortKey, setSortKey] = useState<PasskeysSortKey>('creationTimestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const onSort = (key: PasskeysSortKey) => {
    const next = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(next);
  };

  const sortedPasskeys = useMemo(
    () => sortPasskeys(passkeys, sortKey, sortOrder),
    [passkeys, sortKey, sortOrder],
  );

  const handleView = (record: Passkey) => {
    onView?.(record);
  };

  const handleDelete = (record: Passkey) => {
    Modal.confirm({
      title: PPC.LABELS.DELETE_MODAL_TITLE,
      content: PPC.LABELS.DELETE_MODAL_CONTENT(record?.deviceName || ''),
      okText: PPC.LABELS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: () => {
        onDelete?.(record);
      },
    });
  };

  const handleEdit = (record: Passkey) => {
    onEdit?.(record);
  };

  const columns = Columns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onSort,
    activeSortKey: sortKey,
    sortOrder,
  });

  return (
    <DataTable
      className="app-table"
      columns={columns as any}
      data={sortedPasskeys as any}
      rowKey={(p: any) => p.id}
      rowHeight={PPC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
      onRowClick={handleView}
    />
  );
};

export default PasskeysTable;

