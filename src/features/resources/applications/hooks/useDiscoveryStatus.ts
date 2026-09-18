import { useEffect, useRef, useState } from 'react';
import { fetchDiscoveryStatus } from '../clients';
import type { DiscoveryCycleStatus } from '../models';
import { APPLICATIONS_DISCOVERY_STATUS_POLL_MS, APPLICATIONS_ERROR_MESSAGES } from '../constants';
import logger from '../../../../logging';

// Polls the discovery cycle while the page is open; onCycleComplete fires once
// when a running cycle ends so the list can pick up freshly discovered apps.
export function useDiscoveryStatus(onCycleComplete: () => void) {
  const [status, setStatus] = useState<DiscoveryCycleStatus | null>(null);
  const wasInProgress = useRef(false);
  const onComplete = useRef(onCycleComplete);

  useEffect(() => {
    onComplete.current = onCycleComplete;
  }, [onCycleComplete]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetchDiscoveryStatus();
        if (cancelled) return;
        const next = response.data;
        setStatus(next);
        if (wasInProgress.current && !next.inProgress) onComplete.current();
        wasInProgress.current = next.inProgress;
      } catch (error) {
        logger.error(APPLICATIONS_ERROR_MESSAGES.CLIENT.FETCH_DISCOVERY_STATUS_FAILED, error);
      }
    };
    void poll();
    const interval = setInterval(() => void poll(), APPLICATIONS_DISCOVERY_STATUS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
