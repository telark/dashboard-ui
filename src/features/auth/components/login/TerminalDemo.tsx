import React from 'react';

export const TerminalDemo: React.FC = () => (
  <div
    style={{
      fontFamily: '"SF Mono", "Fira Code", "Roboto Mono", monospace',
      background: 'rgba(0,0,0,0.32)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '16px 18px',
      fontSize: '13px',
      lineHeight: 1.75,
      width: '100%',
    }}
  >
    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <span
          key={c}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: c,
            display: 'inline-block',
          }}
        />
      ))}
    </div>
    <div>
      <span style={{ color: '#475569' }}>$ </span>
      <span style={{ color: '#e2e8f0' }}>kubectl platform auth login</span>
    </div>
    <div className="auth-terminal-line-2">
      <span style={{ color: '#475569' }}>↳ </span>
      <span style={{ color: '#20c997' }}>Passkey challenge sent to device…</span>
    </div>
    <div className="auth-terminal-line-3">
      <span style={{ color: '#475569' }}>✓ </span>
      <span style={{ color: '#e2e8f0' }}>Token issued. Valid for 8h.</span>
      <span className="auth-terminal-cursor" style={{ color: '#20c997', marginLeft: 2 }}>
        █
      </span>
    </div>
  </div>
);
