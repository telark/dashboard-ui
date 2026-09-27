import React from 'react';
import { generateDeviceNameSuggestions } from '../../../utils';
import { DEFAULT_COLORS, withAlpha } from '../../../../../constants';
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
          color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
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
              border: `1px solid ${DEFAULT_COLORS.AUTH_LIGHT_BORDER}`,
              background: DEFAULT_COLORS.SURFACE_WHITE,
              color: DEFAULT_COLORS.TEXT_ON_SURFACE,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontWeight: 400,
              boxShadow: `0 1px 2px 0 ${withAlpha(DEFAULT_COLORS.SHADOW, 0.05)}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.SURFACE_HOVER;
              e.currentTarget.style.borderColor = DEFAULT_COLORS.SUCCESS;
              e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 2px 4px 0 ${withAlpha(DEFAULT_COLORS.SUCCESS, 0.15)}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = DEFAULT_COLORS.SURFACE_WHITE;
              e.currentTarget.style.borderColor = DEFAULT_COLORS.AUTH_LIGHT_BORDER;
              e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 1px 2px 0 ${withAlpha(DEFAULT_COLORS.SHADOW, 0.05)}`;
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
