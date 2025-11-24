import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'antd';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { checkClusterInsightsThunk, setHasClusterInsight } from '../store/slices/insightsSlice';
import type { AppDispatch } from '../../../store';
import { DEFAULT_COLORS } from '../../../constants';
import { INSIGHTS_CONSTANTS } from '../constants';
import { startClusterAnalyze } from '../clients';
import { useNavigate } from 'react-router-dom';

interface StartupProps {
  onStartAnalyze?: () => void;
}

const ArcSpinner: React.FC = () => (
  <motion.div
    style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      border: '6px solid #E6F4EF',
      borderTopColor: DEFAULT_COLORS.SUCCESS,
      margin: '0 auto 12px',
    }}
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
  />
);

// cluster graph nodes (non-spinner)
const InsightsIllustration: React.FC = () => (
  <svg
    width="220"
    height="140"
    viewBox="0 0 220 140"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Cluster insights illustration"
    style={{ marginBottom: 14 }}
  >
    <g fill="none" stroke="#E6EEF3" strokeWidth="2">
      <path d="M40 90 L90 50 L140 70 L180 40" />
      <path d="M60 100 L110 100 L160 90" />
      <path d="M90 50 L110 100" />
    </g>
    <g>
      <circle cx="40" cy="90" r="7" fill="#FFFFFF" stroke="#D8E7EE" />
      <circle cx="90" cy="50" r="9" fill="#FFFFFF" stroke={DEFAULT_COLORS.SUCCESS} />
      <circle cx="140" cy="70" r="7" fill="#FFFFFF" stroke="#D8E7EE" />
      <circle cx="180" cy="40" r="9" fill="#FFFFFF" stroke={DEFAULT_COLORS.SUCCESS} />
      <circle cx="60" cy="100" r="6" fill="#FFFFFF" stroke="#D8E7EE" />
      <circle cx="110" cy="100" r="8" fill="#FFFFFF" stroke={DEFAULT_COLORS.SUCCESS} />
      <circle cx="160" cy="90" r="6" fill="#FFFFFF" stroke="#D8E7EE" />
    </g>
  </svg>
);

const Startup: React.FC<StartupProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [polling, setPolling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);
  const [backendDown, setBackendDown] = useState(false);
  const failureCountRef = useRef(0);
  const insightsScheduledRef = useRef(false);
  const startTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) globalThis.clearTimeout(timeoutRef.current);
    };
  }, []);

  const [starting, setStarting] = useState(true); // auto-start mode
  const handleStart = async () => {
    try {
      setStarting(true);
      const result = await startClusterAnalyze();
      let insightsReady = false;
      if (Array.isArray(result)) {
        const insightsEntry = result.find((r: any) => r?.operation === 'insights');
        insightsReady = Boolean(insightsEntry && Number(insightsEntry.status) === 202);
      } else if (result) {
        const resultAny = result as any;
        if (resultAny.operation === 'insights' || resultAny.insights) {
          const status = resultAny.status ?? resultAny?.insights?.status;
          insightsReady = Number(status) === 202;
        }
      }

      if (insightsReady) {
        dispatch(setHasClusterInsight(true));
        try {
          globalThis.sessionStorage.setItem('WELCOME_PENDING', '1');
        } catch {
          // Ignore storage errors
        }
        navigate('/');
        return;
      }

      // If insights not ready, allow user to try again (stay on screen)
      setStarting(true); // keep spinner
    } catch {
      setStarting(true);
    }
  };

  const cancelScheduledStart = () => {
    if (startTimerRef.current) {
      globalThis.clearTimeout(startTimerRef.current);
      startTimerRef.current = undefined;
      insightsScheduledRef.current = false;
    }
  };

  const scheduleInsightsStart = () => {
    if (!insightsScheduledRef.current) {
      startTimerRef.current = globalThis.setTimeout(() => {
        insightsScheduledRef.current = false;
        void handleStart();
      }, 5000);
      insightsScheduledRef.current = true;
    }
  };

  const handlePollSuccess = (ok: boolean) => {
    setBackendDown(false);
    failureCountRef.current = ok ? 0 : failureCountRef.current + 1;

    if (!ok && !insightsScheduledRef.current) {
      scheduleInsightsStart();
    }

    if (ok) {
      cancelScheduledStart();
    }
  };

  const handlePollError = (e: any) => {
    if (e === 'NETWORK_UNAVAILABLE') {
      setBackendDown(true);
      failureCountRef.current += 1;
      cancelScheduledStart();
    }
  };

  const scheduleNextPoll = (poll: () => void, madeFourFails: boolean) => {
    if (madeFourFails) {
      failureCountRef.current = 0;
    }
    poll();
  };

  // Simple backoff poller after starting insights and to recheck when backend is down
  useEffect(() => {
    if (!polling && starting) {
      setPolling(true);
      const delays = [2000, 4000, 8000, 12000, 20000, 30000];
      let i = 0;
      const poll = () => {
        dispatch(checkClusterInsightsThunk())
          .unwrap()
          .then(handlePollSuccess)
          .catch(handlePollError);

        const madeFourFails = failureCountRef.current >= 4;
        const baseDelay = i < delays.length ? delays[i++] : delays.at(-1)!;
        const nextDelay = madeFourFails ? Math.max(5000, baseDelay) : baseDelay;
        timeoutRef.current = globalThis.setTimeout(
          () => scheduleNextPoll(poll, madeFourFails),
          nextDelay,
        );
      };
      poll();
      return () => {
        if (timeoutRef.current) globalThis.clearTimeout(timeoutRef.current);
        if (startTimerRef.current) globalThis.clearTimeout(startTimerRef.current);
      };
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 820, width: '100%', textAlign: 'center' }}>
        {starting ? <ArcSpinner /> : <InsightsIllustration />}
        <h2 style={{ margin: 0, fontSize: 28, color: '#0B1F33' }}>
          {INSIGHTS_CONSTANTS.INFO.STARTUP.TITLE}
        </h2>
        <p
          style={{
            color: '#5B6B7C',
            marginTop: 12,
            maxWidth: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: 16,
          }}
        >
          {INSIGHTS_CONSTANTS.INFO.STARTUP.DESCRIPTION}
        </p>
        {backendDown && (
          <div style={{ maxWidth: 640, margin: '12px auto 0' }}>
            <Alert
              type="warning"
              showIcon
              message={INSIGHTS_CONSTANTS.WARNING.BACKEND_UNAVAILABLE}
              description={INSIGHTS_CONSTANTS.WARNING.BACKEND_UNAVAILABLE_DESCRIPTION}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Startup;
