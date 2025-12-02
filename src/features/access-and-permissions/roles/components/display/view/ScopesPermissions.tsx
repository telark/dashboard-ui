import React, { useState } from 'react';
import { AiOutlineLock } from 'react-icons/ai';
import { StatusTag } from '../../../../../../components/display/tags';
import { SimpleLabel } from '../../../../../../components/display/labels';
import { CARD_TRANSITIONS } from '../../../../../../constants';
import type { ScopesPermissionsProps } from '../../../models';

const ScopesPermissions: React.FC<ScopesPermissionsProps> = ({ scopes }) => {
  const [hoveredScope, setHoveredScope] = useState<string | null>(null);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <SimpleLabel icon={<AiOutlineLock />} text="Scopes & Permissions" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
        }}
      >
        {Object.entries(scopes).map(([area, scopeValue]) => {
          const isHovered = hoveredScope === area;
          return (
            <div
              key={area}
              aria-label={`${area} permissions`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px',
                background: isHovered
                  ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                  : '#ffffff',
                borderRadius: 12,
                border: `1px solid ${isHovered ? '#3b82f6' : '#e2e8f0'}`,
                boxShadow: isHovered
                  ? '0 8px 24px rgba(59, 130, 246, 0.15)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
                transition: CARD_TRANSITIONS.CARD,
                cursor: 'default',
                minHeight: 'fit-content',
              }}
              onMouseEnter={() => setHoveredScope(area)}
              onMouseLeave={() => setHoveredScope(null)}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0B1F33',
                  textTransform: 'capitalize',
                  letterSpacing: '0.3px',
                  textAlign: 'center',
                }}
              >
                {area}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <StatusTag label={scopeValue.level} color="#3b82f6" borderColor="#3b82f6" />
                {scopeValue.rules && scopeValue.rules.length > 0 && (
                  <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>
                    Blocked: {scopeValue.rules.join(', ')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScopesPermissions;
