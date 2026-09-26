import React from 'react';
import { CARD_LAYOUT, DEFAULT_COLORS } from '../../constants';
import { usePermission } from '../../features/auth/hooks/permissions/permissionEngine';
import type { RequiredPermission } from '../../interfaces/shared';
import { NO_PERMISSION_CONSTANTS as NP } from './noPermission.constants';

interface NoPermissionCardProps {
  featureName: string;
  permission: RequiredPermission;
  /** Text only, for a host that already draws the card and title (home dashboard boxes). */
  compact?: boolean;
}

const cardStyle: React.CSSProperties = {
  background: DEFAULT_COLORS.SURFACE_ELEVATED,
  borderRadius: CARD_LAYOUT.RADIUS_PX,
  padding: NP.LAYOUT.CARD_PADDING_PX,
  border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
};

const NoPermissionCard: React.FC<NoPermissionCardProps> = ({
  featureName,
  permission: { scope, level, deny },
  compact = false,
}) => {
  const levelGranted = usePermission(scope, level);
  const allowed = usePermission(scope, level, deny);
  const lines = [
    NP.LABELS.DESCRIPTION(featureName),
    NP.LABELS.REQUIREMENT(level, scope),
    ...(deny && levelGranted && !allowed ? [NP.LABELS.DENY_RULE(deny)] : []),
    NP.LABELS.HINT,
  ];
  const text = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: NP.LAYOUT.LINE_GAP_PX }}>
      {lines.map((line) => (
        <p
          key={line}
          style={{
            margin: 0,
            fontSize: compact ? NP.LAYOUT.COMPACT_FONT_SIZE_PX : NP.LAYOUT.TEXT_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
  if (compact) return text;

  return (
    <div style={cardStyle}>
      <h3
        style={{
          margin: `0 0 ${NP.LAYOUT.LINE_GAP_PX * 2}px`,
          fontSize: NP.LAYOUT.TITLE_FONT_SIZE_PX,
          fontWeight: 600,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
        }}
      >
        {NP.LABELS.TITLE}
      </h3>
      {text}
    </div>
  );
};

export default NoPermissionCard;
