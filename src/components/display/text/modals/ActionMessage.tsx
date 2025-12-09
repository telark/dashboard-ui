import React from 'react';
import { ACTION_CONFIRM_MODAL } from '../../../../constants';
import { buildConfirmMessage } from '../../../../utils/layout/modals/buildMessage';

interface ActionMessageProps {
  action: string;
  resourceName: string;
  resourceType?: string;
}

const ActionMessage: React.FC<ActionMessageProps> = ({ action, resourceName, resourceType }) => {
  const message = buildConfirmMessage(action, resourceName, resourceType);

  return (
    <div
      style={{
        fontSize: ACTION_CONFIRM_MODAL.MESSAGE.FONT_SIZE,
        lineHeight: ACTION_CONFIRM_MODAL.MESSAGE.LINE_HEIGHT,
        color: ACTION_CONFIRM_MODAL.MESSAGE.COLOR,
        textAlign: 'center',
        marginTop: ACTION_CONFIRM_MODAL.MESSAGE.MARGIN_TOP,
      }}
    >
      {message}
      <span
        style={{
          fontWeight: ACTION_CONFIRM_MODAL.MESSAGE.RESOURCE_NAME_FONT_WEIGHT,
          color: ACTION_CONFIRM_MODAL.MESSAGE.RESOURCE_NAME_COLOR,
        }}
      >
        {resourceName}
      </span>
      ?
    </div>
  );
};

export default ActionMessage;
