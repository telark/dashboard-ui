import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'antd';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { checkClusterInsightsThunk, setHasClusterInsight } from '../../store/insights/slices/insightsSlice';
import type { AppDispatch } from '../../store';
import { DEFAULT_COLORS } from '../../constants';
import { startClusterAnalyze } from '../../clients/configurator';
import { useNavigate } from 'react-router-dom';

interface StartupProps {
  onStartAnalyze?: () => void;
}

// Minimal, clean spinner for the starting phase (green arc)
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

// Simple, modern illustration: cluster graph nodes (non-spinner)
const AnalysisIllustration: React.FC = () => (
  <svg
    width="220"
    height="140"
    viewBox="0 0 220 140"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Cluster analysis illustration"
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

const Startup: React.FC<StartupProps> = ({ onStartAnalyze }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [polling, setPolling] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const [backendDown, setBackendDown] = useState(false);
  const failureCountRef = useRef(0);
  const analyzeScheduledRef = useRef(false);
  const startTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const [starting, setStarting] = useState(true); // auto-start mode
  const handleStart = async () => {
    try {
      setStarting(true);
      const result = await startClusterAnalyze();
      let insightsReady = false;
      if (Array.isArray(result)) {
        const insightsEntry = result.find((r: any) => r && r.operation === 'insights');
        insightsReady = Boolean(insightsEntry && Number(insightsEntry.status) === 202);
      } else if (result && (result.operation === 'insights' || result.insights)) {
        const status = result.status ?? result?.insights?.status;
        insightsReady = Number(status) === 202;
      }

      if (insightsReady) {
        dispatch(setHasClusterInsight(true));
        try {
          window.sessionStorage.setItem('WELCOME_PENDING', '1');
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

  // Simple backoff poller after starting analyze and to recheck when backend is down
  useEffect(() => {
    if (!polling && starting) {
      setPolling(true);
      const delays = [2000, 4000, 8000, 12000, 20000, 30000];
      let i = 0;
      const poll = () => {
        dispatch(checkClusterInsightsThunk())
          .unwrap()
          .then((ok) => {
            // Non-network response received (ok==true means insights ready, ok==false means 404)
            setBackendDown(false);
            failureCountRef.current = ok ? 0 : failureCountRef.current + 1;
            // Schedule analyze start only if backend is reachable and insights missing (404)
            if (!ok && !analyzeScheduledRef.current) {
              startTimerRef.current = window.setTimeout(() => {
                analyzeScheduledRef.current = false;
                void handleStart();
              }, 5000);
              analyzeScheduledRef.current = true;
            }
            // If insights ready, cancel any scheduled start
            if (ok && startTimerRef.current) {
              window.clearTimeout(startTimerRef.current);
              startTimerRef.current = undefined;
              analyzeScheduledRef.current = false;
            }
          })
          .catch((e: any) => {
            if (e === 'NETWORK_UNAVAILABLE') {
              setBackendDown(true);
              failureCountRef.current += 1;
              // Cancel any scheduled start if backend is down
              if (startTimerRef.current) {
                window.clearTimeout(startTimerRef.current);
                startTimerRef.current = undefined;
                analyzeScheduledRef.current = false;
              }
            }
          });
        const madeFourFails = failureCountRef.current >= 4;
        const baseDelay = i < delays.length ? delays[i++] : delays[delays.length - 1];
        const nextDelay = madeFourFails ? Math.max(5000, baseDelay) : baseDelay;
        timeoutRef.current = window.setTimeout(() => {
          if (madeFourFails) {
            failureCountRef.current = 0;
          }
          poll();
        }, nextDelay);
      };
      poll();
      return () => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        if (startTimerRef.current) window.clearTimeout(startTimerRef.current);
      };
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {starting ? <ArcSpinner /> : <AnalysisIllustration />}
        <h2 style={{ margin: 0, fontSize: 28, color: '#0B1F33' }}>
          Preparing your cluster analysis
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
          We’ll scan your cluster to surface health, workload insights, and trends. Kick off the
          first analysis now — it’s quick, read‑only, and safe for production workloads.
        </p>
        {backendDown && (
          <div style={{ maxWidth: 640, margin: '12px auto 0' }}>
            <Alert
              type="warning"
              showIcon
              message="Backend unavailable"
              description="We can’t reach the services yet. We’ll retry with increasing intervals. Please start your backend if it’s stopped."
            />
          </div>
        )}
        {/* Auto-start: button removed; spinner indicates progress */}
      </div>
    </div>
  );
};

export default Startup;
