import React, { useEffect } from 'react';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { checkClusterInsightsThunk } from '../store/slices/insightsSlice';
import type { AppDispatch } from '../store';
import { DEFAULT_COLORS } from '../constants';

interface StartupProps {
  onStartAnalyze?: () => void;
}

const Startup: React.FC<StartupProps> = ({ onStartAnalyze }) => {
  const dispatch: AppDispatch = useDispatch();

  // Auto-poll every 3s to detect when analysis becomes available
  useEffect(() => {
    const id = window.setInterval(() => dispatch(checkClusterInsightsThunk()), 3000);
    return () => window.clearInterval(id);
  }, [dispatch]);

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
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20, width: 96, height: 96 }}>
          {/* Base subtle ring */}
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="48" cy="48" r="36" stroke={DEFAULT_COLORS.SUCCESS} strokeWidth="6" opacity="0.15" />
          </svg>

          {/* Continuous rotating arc (spinner) */}
          <motion.svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
          >
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke={DEFAULT_COLORS.SUCCESS}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="80 300" /* 80px arc, rest gap */
            />
          </motion.svg>
        </div>
        <h2 style={{ margin: 0, fontSize: 28, color: '#0B1F33' }}>Preparing your cluster analysis</h2>
        <p style={{ color: '#5B6B7C', marginTop: 12, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', fontSize: 16 }}>
          We’ll scan your cluster to surface health, workload insights, and trends. Kick off the first analysis now
          — it’s quick, read‑only, and safe for production workloads.
        </p>
        <Button type="primary" size="large" onClick={onStartAnalyze} style={{ background: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS }}>
          Start analyze
        </Button>
      </div>
    </div>
  );
};

export default Startup;


