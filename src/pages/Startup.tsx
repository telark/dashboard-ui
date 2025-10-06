import React from 'react';
import { Button } from 'antd';
import { DEFAULT_COLORS } from '../constants';

interface StartupProps {
  onStartAnalyze?: () => void;
}

const Startup: React.FC<StartupProps> = ({ onStartAnalyze }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: DEFAULT_COLORS.PAGE_BG,
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: '100%',
          textAlign: 'center',
          background: '#fff',
          borderRadius: 12,
          padding: '48px 24px',
          boxShadow: '0 10px 30px rgba(11,31,51,0.06)',
          border: '1px solid #EEF2F6',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5h18M3 12h18M3 19h18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 style={{ margin: 0, fontSize: 24, color: '#0B1F33' }}>We are analyzing your project.</h2>
        <p style={{ color: '#5B6B7C', marginTop: 12 }}>
          You should see this page refresh in a few moments with your analysis results.
        </p>
        <div style={{ textAlign: 'left', maxWidth: 520, margin: '16px auto 24px', color: '#334155' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span>✔</span>
            <span>You will get a first analysis of your default branch and recent Pull Requests.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span>✔</span>
            <span>Each new push on your default branch will trigger a new analysis automatically.</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span>✔</span>
            <span>Each new push to a Pull Request will also trigger an analysis.</span>
          </div>
        </div>
        <Button type="primary" size="large" onClick={onStartAnalyze}>
          Start analyze
        </Button>
      </div>
    </div>
  );
};

export default Startup;


