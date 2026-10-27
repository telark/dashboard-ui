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
  /** A recovery is only ever denied: Approve stays, off, with the reason. */
  recovery?: boolean;
  /** Why the buttons are off for this viewer, on hover and focus; unset when they may decide. */
  deniedReason?: string;
  block?: boolean;
  onDecided: (action: BootstrapAction) => void;
}

// The approval page and the Bootstrap account card decide with the same buttons and the same ceremony.
const DecideButtons: React.FC<DecideButtonsProps> = ({
  requestId,
  canApprove,
  recovery = false,
  deniedReason,
  block = false,
  onDecided,
}) => {
  const { message } = AntdApp.useApp();
  const [running, setRunning] = useState<BootstrapAction | null>(null);
  // Auth's 409 says why the request can't be decided now: the buttons give way to that reason.
  const [closed, setClosed] = useState<{ id: string; reason: string } | null>(null);

  const decide = async (action: BootstrapAction) => {
    setRunning(action);
    try {
      await decideRequest(requestId, action);
      onDecided(action);
    } catch (err: unknown) {
      if ((err as ExtendedAxiosError).normalized?.status === HTTP_STATUS.CONFLICT) {
        // Auth's reasons are Go errors, which start lowercase.
        const reason = extractErrorMessage(err, T.NOT_OPEN);
        setClosed({ id: requestId, reason: reason.charAt(0).toUpperCase() + reason.slice(1) });
      } else {
        message.error(extractErrorMessage(err, T.DECIDE_FAILED));
      }
    } finally {
      setRunning(null);
    }
  };

  if (closed?.id === requestId) {
    return <Alert title={closed.reason} type="error" showIcon style={C.LAYOUT.ALERT} />;
  }

  // aria-disabled rather than disabled, so the button keeps hover and focus, and both show the reason.
  const button = (action: BootstrapAction, label: string, primary: boolean, offReason?: string) => (
    <Tooltip key={action} title={offReason} trigger={['hover', 'focus']}>
      <Button
        type={primary ? 'primary' : 'default'}
        danger={!primary}
        block={block}
        loading={running === action}
        aria-disabled={offReason !== undefined}
        className={offReason === undefined ? undefined : C.DISABLED_CLASS}
        disabled={running !== null && running !== action}
        onClick={() => {
          if (offReason === undefined) void decide(action);
        }}
      >
        {label}
      </Button>
    </Tooltip>
  );
  const approveOffReason = deniedReason ?? (recovery ? T.APPROVE_RECOVERY : undefined);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: block ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: C.LAYOUT.BUTTON_GAP,
      }}
    >
      {canApprove && button(C.ACTION.APPROVE, T.APPROVE, true, approveOffReason)}
      {button(C.ACTION.DENY, T.DENY, false, deniedReason)}
    </div>
  );
};

export default DecideButtons;
