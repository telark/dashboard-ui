import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { getCurrentSessionName } from '../../../../../features/auth/utils/session/token';
import { validateSession } from '../../../../../features/auth/utils/session/validation';
import { handleUserLogout } from '../../../../../features/auth/utils/logout/logout';
import { SECURITY_SECTION_CONSTANTS } from '../constants';
import type { SessionDetails } from '../../../../../features/auth/models/session';

const { LABELS } = SECURITY_SECTION_CONSTANTS;

// A listed session is addressed by its resource name; the current-token
// fallback carries none and can only ever be this device.
const revokesThisDevice = (
  sessionName: string | null,
  currentSessionName: string | null,
): boolean => sessionName === null || sessionName === currentSessionName;

const getRevokeModalMessage = (
  sessionName: string | null,
  currentSessionName: string | null,
): string => {
  if (revokesThisDevice(sessionName, currentSessionName)) {
    return LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_CURRENT;
  }
  if (currentSessionName === null) {
    return LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_UNKNOWN;
  }
  return LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_OTHER;
};

export interface UseSessionRevokeOptions {
  revokeSession: (
    sessionName: string,
    options: { onRevokedCurrentSession?: () => void },
  ) => Promise<void>;
}

export interface UseSessionRevokeResult {
  sessionToRevoke: SessionDetails | null;
  revokingSessionName: string | null;
  currentSessionName: string | null;
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
  const [revokingSessionName, setRevokingSessionName] = useState<string | null>(null);
  const [sessionToRevoke, setSessionToRevoke] = useState<SessionDetails | null>(null);
  const [currentSessionName, setCurrentSessionName] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    getCurrentSessionName().then((name) => {
      if (!canceled) setCurrentSessionName(name);
    });
    return () => {
      canceled = true;
    };
  }, []);

  const handleRevokeClick = useCallback((session: SessionDetails) => {
    setSessionToRevoke(session);
  }, []);

  const closeRevokeModal = useCallback(() => {
    setSessionToRevoke(null);
  }, []);

  // crypto.subtle only exists in a secure context, so the current session name
  // can be unknown. The revoked device may then have been this one, and only
  // the server can say whether this session survived. isExpired, not isValid:
  // a transient network failure must not sign the user out.
  const reportRevokeOutcome = useCallback(async () => {
    if (currentSessionName === null && (await validateSession()).isExpired) {
      await handleUserLogout(navigate, message);
      return;
    }
    message.success(LABELS.SESSIONS_REVOKE_SUCCESS);
  }, [currentSessionName, navigate, message]);

  const handleRevokeConfirm = useCallback(async () => {
    if (!sessionToRevoke) return;
    const sessionName = sessionToRevoke.metadata?.name ?? null;
    const isCurrent = revokesThisDevice(sessionName, currentSessionName);
    setRevokingSessionName(sessionName);
    setSessionToRevoke(null);
    try {
      if (sessionName === null || isCurrent) {
        await handleUserLogout(navigate, message);
      } else {
        await revokeSession(sessionName, {});
        await reportRevokeOutcome();
      }
    } catch {
      if (!isCurrent) {
        message.error(LABELS.SESSIONS_REVOKE_ERROR);
      }
    } finally {
      setRevokingSessionName(null);
    }
  }, [sessionToRevoke, currentSessionName, revokeSession, navigate, message, reportRevokeOutcome]);

  const revokeModalMessage = getRevokeModalMessage(
    sessionToRevoke?.metadata?.name ?? null,
    currentSessionName,
  );

  return {
    sessionToRevoke,
    revokingSessionName,
    currentSessionName,
    handleRevokeClick,
    handleRevokeConfirm,
    closeRevokeModal,
    revokeModalMessage,
  };
};
