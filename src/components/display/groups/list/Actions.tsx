import React from 'react';
import { GROUPS_CONSTANTS as GC } from '../../../../constants/pages/groups';
import type { Group } from '../../../../interfaces/groups';
import RowOptions from '../../shared/actions/RowOptions';

interface ActionsProps {
  record: Group;
  onView: (r: Group) => void;
  onEdit?: (r: Group) => void;
  onDelete: (r: Group) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onEdit, onDelete }) => {
  return (
    <RowOptions
      record={record}
      labels={GC.LABELS.ACTIONS}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default Actions;
