import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { getSessionToken } from '../../../../../features/auth/utils/session/token';
import { handleUserLogout } from '../../../../../features/auth/utils/logout/logout';
import { SECURITY_SECTION_CONSTANTS } from '../constants';
import type { SessionDetails } from '../../../../../features/auth/models/session';

const { LABELS } = SECURITY_SECTION_CONSTANTS;

export interface UseSessionRevokeOptions {
  revokeSession: (
    sessionToken: string,
    options: { onRevokedCurrentSession?: () => void },
  ) => Promise<void>;
}

export interface UseSessionRevokeResult {
  sessionToRevoke: SessionDetails | null;
  revokingToken: string | null;
  currentToken: string | null;
  handleRevokeClick: (session: SessionDetails) => void;
  handleRevokeConfirm: () => Promise<void>;
  closeRevokeModal: () => void;
  revokeModalMessage: string;
}

export const useSessionRevoke = ({
  revokeSession,
}: UseSessionRevokeOptions): UseSessionRevokeResult => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [sessionToRevoke, setSessionToRevoke] = useState<SessionDetails | null>(null);
  const currentToken = getSessionToken();

  const handleRevokeClick = useCallback((session: SessionDetails) => {
    setSessionToRevoke(session);
  }, []);

  const closeRevokeModal = useCallback(() => {
    setSessionToRevoke(null);
  }, []);

  const handleRevokeConfirm = useCallback(async () => {
    if (!sessionToRevoke) return;
    const isCurrent = sessionToRevoke.sessionToken === currentToken;
    setRevokingToken(sessionToRevoke.sessionToken);
    setSessionToRevoke(null);
    try {
      if (isCurrent) {
        await handleUserLogout(navigate, message);
      } else {
        await revokeSession(sessionToRevoke.sessionToken, {});
        message.success(LABELS.SESSIONS_REVOKE_SUCCESS);
      }
    } catch {
      if (!isCurrent) {
        message.error(LABELS.SESSIONS_REVOKE_ERROR);
      }
    } finally {
      setRevokingToken(null);
    }
  }, [sessionToRevoke, currentToken, revokeSession, navigate, message]);

  const revokeModalMessage =
    sessionToRevoke?.sessionToken === currentToken
      ? LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_CURRENT
      : LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_OTHER;

  return {
    sessionToRevoke,
    revokingToken,
    currentToken,
    handleRevokeClick,
    handleRevokeConfirm,
    closeRevokeModal,
    revokeModalMessage,
  };
};
