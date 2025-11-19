import React, { useMemo, useState } from 'react';
import { App } from 'antd';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants/pages/passkeys';
import type { Passkey } from '../../../../interfaces/auth/passkeys';
import { Columns } from './Columns';
import { PasskeysSortKey, sortPasskeys } from './utils';
import DataTable from '../../shared/table/DataTable';

interface PasskeysTableProps {
  passkeys: Passkey[];
  onView?: (passkey: Passkey) => void;
  onEdit?: (passkey: Passkey) => void;
  onDelete: (passkey: Passkey, forceLastDelete?: boolean) => Promise<void>;
}

const PasskeysTable: React.FC<PasskeysTableProps> = ({ passkeys, onView, onEdit, onDelete }) => {
  const { modal } = App.useApp();
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
    const isLastPasskey = passkeys.length === 1;
    const passkeyName = record?.deviceName || '';
    const contentText = isLastPasskey
      ? PPC.LABELS.FORCE_DELETE_MODAL_CONTENT(passkeyName)
      : PPC.LABELS.DELETE_MODAL_CONTENT(passkeyName);

    // Render content with passkey name in bold
    const renderContent = () => {
      const parts = contentText.split(passkeyName);
      return (
        <div style={{ whiteSpace: 'pre-line' }}>
          {parts[0]}
          <strong>{passkeyName}</strong>
          {parts[1]}
        </div>
      );
    };

    modal.confirm({
      title: isLastPasskey ? PPC.LABELS.FORCE_DELETE_MODAL_TITLE : PPC.LABELS.DELETE_MODAL_TITLE,
      content: renderContent(),
      okText: isLastPasskey ? PPC.LABELS.FORCE_DELETE_MODAL_OK : PPC.LABELS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      icon: null,
      onOk: async () => {
        try {
          await onDelete(record, isLastPasskey);
        } catch {
          // Error is handled by the onDelete function
        }
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
      rowKey={(p: any) => p.id || p.credentialId}
      rowHeight={PPC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
      onRowClick={handleView}
    />
  );
};

export default PasskeysTable;
