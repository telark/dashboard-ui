import React from 'react';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import type { Role } from '../../../models';
import RowOptions from '../../../../../../components/display/actions/RowOptions';

interface ActionsProps {
  record: Role;
  onView: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete: (r: Role) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onEdit, onDelete }) => {
  return (
    <RowOptions
      record={record}
      labels={RPC.LABELS.ACTIONS}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default Actions;
