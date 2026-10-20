import React, { useState } from 'react';
import { Alert, App as AntdApp, Button, Tooltip } from 'antd';
import type { ExtendedAxiosError } from '../../../api/client/normalize';
import { HTTP_STATUS } from '../../../constants';
import { extractErrorMessage } from '../../../utils/helpers/format';
import { BOOTSTRAP_CONSTANTS as C, BOOTSTRAP_TEXTS as T } from '../constants/bootstrap';
import { decideRequest } from '../utils/decide';
import type { BootstrapAction } from '../models/bootstrap';

interface DecideButtonsProps {
  requestId: string;
  /** A pending request is approved or denied; an approved one can only be denied. */
  canApprove: boolean;
  /** Why the buttons are off for this viewer, on hover and focus; unset when they may decide. */
  deniedReason?: string;
  block?: boolean;
  onDecided: (action: BootstrapAction) => void;
}

// The approval page and the Bootstrap account card decide with the same buttons and the same ceremony.
const DecideButtons: React.FC<DecideButtonsProps> = ({
  requestId,
  canApprove,
  deniedReason,
  block = false,
  onDecided,
}) => {
  const { message } = AntdApp.useApp();
  const [running, setRunning] = useState<BootstrapAction | null>(null);
  // Auth answers 409 for a request that is no longer open: its buttons give way to the reason.
  const [closedId, setClosedId] = useState<string | null>(null);
  const denied = deniedReason !== undefined;

  const decide = async (action: BootstrapAction) => {
    setRunning(action);
    try {
      await decideRequest(requestId, action);
      onDecided(action);
    } catch (err: unknown) {
      if ((err as ExtendedAxiosError).normalized?.status === HTTP_STATUS.CONFLICT) {
        setClosedId(requestId);
      } else {
        message.error(extractErrorMessage(err, T.DECIDE_FAILED));
      }
    } finally {
      setRunning(null);
    }
  };

  if (closedId === requestId) {
    return <Alert title={T.NOT_OPEN} type="error" showIcon style={C.LAYOUT.ALERT} />;
  }

  // aria-disabled rather than disabled, so the button keeps hover and focus, and both show the reason.
  const button = (action: BootstrapAction, label: string, primary: boolean) => (
    <Tooltip key={action} title={deniedReason} trigger={['hover', 'focus']}>
      <Button
        type={primary ? 'primary' : 'default'}
        danger={!primary}
        block={block}
        loading={running === action}
        aria-disabled={denied}
        className={denied ? C.DISABLED_CLASS : undefined}
        disabled={running !== null && running !== action}
        onClick={() => {
          if (!denied) void decide(action);
        }}
      >
        {label}
      </Button>
    </Tooltip>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: block ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: C.LAYOUT.BUTTON_GAP,
      }}
    >
      {canApprove && button(C.ACTION.APPROVE, T.APPROVE, true)}
      {button(C.ACTION.DENY, T.DENY, false)}
    </div>
  );
};

export default DecideButtons;
