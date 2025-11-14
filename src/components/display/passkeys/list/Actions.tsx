import React from 'react';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../../constants/pages/passkeys';
import type { Passkey } from '../../../../interfaces/passkeys';
import RowOptions from '../../shared/actions/RowOptions';

interface ActionsProps {
  record: Passkey;
  onView: (r: Passkey) => void;
  onEdit?: (r: Passkey) => void;
  onDelete: (r: Passkey) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onEdit, onDelete }) => {
  return (
    <RowOptions
      record={record}
      labels={PPC.LABELS.ACTIONS}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default Actions;
