import React from 'react';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../../constants/passkeys';
import type { Passkey } from '../../../models/passkeys';
import RowOptions from '../../../../../components/display/shared/actions/RowOptions';

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
