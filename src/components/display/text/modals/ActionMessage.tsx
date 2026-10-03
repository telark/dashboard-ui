import React from 'react';
import { MODAL_CHROME } from '../../../../constants';
import { buildConfirmMessage } from '../../../../utils/layout/modals/buildMessage';

interface ActionMessageProps {
  action: string;
  resourceName: string;
  resourceType?: string;
  customMessage?: React.ReactNode;
}

const ActionMessage: React.FC<ActionMessageProps> = ({
  action,
  resourceName,
  resourceType,
  customMessage,
}) => {
  if (customMessage) return <>{customMessage}</>;

  return (
    <>
      {buildConfirmMessage(action, resourceName, resourceType)}
      <span style={MODAL_CHROME.RESOURCE_NAME}>{resourceName}</span>?
    </>
  );
};

export default ActionMessage;
