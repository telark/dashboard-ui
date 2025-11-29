import React from 'react';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import RowOptions from '../../../../../../components/display/actions/RowOptions';
import type { ActionsProps } from '../../../models';

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
