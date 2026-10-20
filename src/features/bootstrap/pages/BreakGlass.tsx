import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthCard, AuthHeader, InsecureContextAlert } from '../../auth/components';
import { isWebAuthnSupported } from '../../auth/utils';
import { APP_ROUTES } from '../../../constants';
import { BOOTSTRAP_CONSTANTS as C, BOOTSTRAP_TEXTS as T } from '../constants/bootstrap';
import DecideButtons from '../components/DecideButtons';
import type { BootstrapAction } from '../models/bootstrap';

const readRequestId = (hash: string): string | undefined =>
  new URLSearchParams(hash.slice(1)).get(C.FRAGMENT_REQUEST) ?? undefined;

// Public, and it never stores a session: a sign-in by the bootstrap account would cancel the request.
const BreakGlass: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Kept in state: the id leaves the address bar right away. A link pasted into this tab
  // brings a new request, and the previous outcome goes with the old one.
  const [requestId, setRequestId] = useState(() => readRequestId(location.hash));
  const [decided, setDecided] = useState<BootstrapAction | null>(null);
  const linkId = readRequestId(location.hash);
  if (linkId !== undefined && linkId !== requestId) {
    setRequestId(linkId);
    setDecided(null);
  }
  const passkeysAvailable = isWebAuthnSupported();

  useEffect(() => {
    if (location.hash) navigate(APP_ROUTES.BREAK_GLASS, { replace: true });
  }, [location.hash, navigate]);

  const outcome = decided === C.ACTION.APPROVE ? T.PAGE_APPROVED : T.PAGE_DENIED;
  return (
    <AuthCard>
      <AuthHeader title={T.PAGE_TITLE} subtitle={requestId ? T.PAGE_SUBTITLE : T.PAGE_NO_REQUEST} />
      {requestId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.PAGE_GAP }}>
          {!passkeysAvailable && <InsecureContextAlert />}
          {decided ? (
            <Alert title={outcome} type="success" showIcon style={C.LAYOUT.ALERT} />
          ) : (
            <>
              <Alert title={T.PAGE_WARNING} type="warning" showIcon style={C.LAYOUT.ALERT} />
              <DecideButtons
                requestId={requestId}
                canApprove
                block
                deniedReason={passkeysAvailable ? undefined : T.PASSKEYS_UNAVAILABLE}
                onDecided={setDecided}
              />
            </>
          )}
        </div>
      )}
    </AuthCard>
  );
};

export default BreakGlass;
