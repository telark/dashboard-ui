import React from 'react';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { User } from '../../../models';
import RowOptions from '../../../../../../components/display/actions/RowOptions';

interface ActionsProps {
  record: User;
  onView: (r: User) => void;
  onEdit?: (r: User) => void;
  onDelete: (r: User) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onEdit, onDelete }) => {
  return (
    <RowOptions
      record={record}
      labels={UC.LABELS.ACTIONS}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default Actions;
