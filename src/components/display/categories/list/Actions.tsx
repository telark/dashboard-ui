import React from 'react';
import { CATEGORIES_CONSTANTS as CC } from '../../../../constants/pages/categories';
import type { Category } from '../../../../interfaces/categories';
import RowOptions from '../../shared/actions/RowOptions';

interface ActionsProps {
  record: Category;
  onView: (r: Category) => void;
  onEdit?: (r: Category) => void;
  onDelete: (r: Category) => void;
}

const Actions: React.FC<ActionsProps> = ({ record, onView, onEdit, onDelete }) => {
  return (
    <RowOptions
      record={record}
      labels={CC.LABELS.ACTIONS}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default Actions;
