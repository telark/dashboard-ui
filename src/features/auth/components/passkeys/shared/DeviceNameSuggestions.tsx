import React from 'react';
import { generateDeviceNameSuggestions } from '../../../utils/passkey/device';
import { PASSKEYS_CONSTANTS as PPC } from '../../../constants/passkeys';
import type { Passkey } from '../../../models/passkeys';

interface DeviceNameSuggestionsProps {
  onSelect: (suggestion: string) => void;
  existingPasskeys: Passkey[];
}

const DeviceNameSuggestions: React.FC<DeviceNameSuggestionsProps> = ({
  onSelect,
  existingPasskeys,
}) => {
  const existingNames = React.useMemo(
    () => existingPasskeys.map((p) => p.deviceName || '').filter(Boolean),
    [existingPasskeys],
  );

  const suggestions = React.useMemo(
    () => generateDeviceNameSuggestions(existingNames, existingPasskeys.length),
    [existingNames, existingPasskeys.length],
  );

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: 12, marginBottom: 0 }}>
      <div
        style={{
          fontSize: 11,
          color: '#64748b',
          marginBottom: 8,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {PPC.FORM.SUGGESTIONS_TITLE}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#0B1F33',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontWeight: 400,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#0ea5e9';
              e.currentTarget.style.color = '#0ea5e9';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 4px 0 rgba(14, 165, 233, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#0B1F33';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeviceNameSuggestions;
