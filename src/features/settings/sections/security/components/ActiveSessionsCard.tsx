import React, { memo, useMemo } from 'react';
import SettingsCard from '../../../components/SettingsCard';
import { useSessionsList } from '../../../../../features/auth/hooks';
import { useSessionRevoke } from '../hooks/useSessionRevoke';
import { SECURITY_SECTION_CONSTANTS } from '../constants';
import SessionsTable from './SessionsTable';
import RevokeSessionModal from './RevokeSessionModal';

const { LABELS } = SECURITY_SECTION_CONSTANTS;

const ActiveSessionsCard: React.FC = memo(() => {
  const { sessions, loading, error, revokeSession } = useSessionsList();
  const {
    sessionToRevoke,
    revokingSessionName,
    currentSessionName,
    handleRevokeClick,
    handleRevokeConfirm,
    closeRevokeModal,
    revokeModalMessage,
  } = useSessionRevoke({ revokeSession });

  const sortedSessions = useMemo(() => {
    if (!currentSessionName) return sessions;
    const current = sessions.find((s) => s.metadata?.name === currentSessionName);
    const rest = sessions.filter((s) => s.metadata?.name !== currentSessionName);
    return current ? [current, ...rest] : sessions;
  }, [sessions, currentSessionName]);

  return (
    <>
      <SettingsCard
        title={LABELS.ACTIVE_SESSIONS_CARD_TITLE}
        description={LABELS.ACTIVE_SESSIONS_CARD_DESCRIPTION}
      >
        <SessionsTable
          sessions={sortedSessions}
          loading={loading}
          error={error}
          currentSessionName={currentSessionName}
          revokingSessionName={revokingSessionName}
          onRevokeClick={handleRevokeClick}
        />
      </SettingsCard>
      <RevokeSessionModal
        open={sessionToRevoke !== null}
        message={revokeModalMessage}
        onConfirm={handleRevokeConfirm}
        onCancel={closeRevokeModal}
        confirming={revokingSessionName !== null}
      />
    </>
  );
});

ActiveSessionsCard.displayName = 'ActiveSessionsCard';

export default ActiveSessionsCard;
