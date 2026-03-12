import React from 'react';
import { DEFAULT_COLORS, Icons } from '../../../../constants';

const NoProtectionPlansState: React.FC = () => (
  <div
    style={{
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'rgba(32,201,151,0.12)',
        boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        color: '#20C997',
        fontSize: 24,
      }}
    >
      <Icons.ProtectionPlans />
    </div>
    <h3
      style={{
        margin: 0,
        marginBottom: 8,
        fontSize: 18,
        fontWeight: 600,
        color: DEFAULT_COLORS.TEXT_PRIMARY,
      }}
    >
      No plans found
    </h3>
    <p
      style={{
        margin: 0,
        fontSize: 14,
        color: DEFAULT_COLORS.TEXT_MUTED,
        maxWidth: 480,
      }}
    >
      Try adjusting your search or create a new Protection Plan to guard critical workloads.
    </p>
  </div>
);

export default NoProtectionPlansState;

