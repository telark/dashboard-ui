import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, withAlpha } from '../../constants';
import { usePermission } from '../../features/auth/hooks/permissions/permissionEngine';
import type { RequiredPermission } from '../../interfaces/shared';
import EmptyState from '../display/views/EmptyState';
import { NO_PERMISSION_CONSTANTS as NP } from './noPermission.constants';

interface NoPermissionCardProps {
  featureName: string;
  permission: RequiredPermission;
  /** Small lock state for a host on a light panel (role pickers). */
  compact?: boolean;
  /** Small lock state for a host that already draws a titled box (home dashboard boxes). */
  emptyState?: boolean;
}

const LOCK_COLORS = {
  dark: { title: DEFAULT_COLORS.TEXT_SECONDARY, muted: DEFAULT_COLORS.TEXT_MUTED },
  light: { title: DEFAULT_COLORS.TEXT_ON_SURFACE, muted: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED },
} as const;

const lockStateStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: NP.LAYOUT.LOCK_GAP_PX,
  textAlign: 'center',
};

const iconBadgeStyle = (color: string): React.CSSProperties => ({
  width: NP.LAYOUT.BOX.BADGE_PX,
  height: NP.LAYOUT.BOX.BADGE_PX,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: NP.LAYOUT.BOX.ICON_PX,
  color,
  background: withAlpha(color, NP.LAYOUT.ICON_BADGE_ALPHA),
});

const NoPermissionCard: React.FC<NoPermissionCardProps> = ({
  featureName,
  permission: { scope, level, deny },
  compact = false,
  emptyState = false,
}) => {
  const levelGranted = usePermission(scope, level);
  const allowed = usePermission(scope, level, deny);
  const denied = Boolean(deny) && levelGranted && !allowed;

  if (!compact && !emptyState) {
    // Same presentation as the pages' empty states.
    return (
      <EmptyState
        icon={<LockOutlined style={{ fontSize: NP.LAYOUT.PAGE_ICON_PX }} />}
        title={NP.LABELS.TITLE(featureName)}
        description={denied ? NP.LABELS.SHORT_DENY : NP.LABELS.PAGE_HINT(level, scope)}
      />
    );
  }

  // The host already names the feature (box title, field label), so this only says what is missing.
  const colors = compact ? LOCK_COLORS.light : LOCK_COLORS.dark;
  return (
    <div
      style={
        compact ? { ...lockStateStyle, padding: NP.LAYOUT.COMPACT_PADDING_PX } : lockStateStyle
      }
    >
      <span style={iconBadgeStyle(colors.muted)} aria-hidden>
        <LockOutlined />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: NP.LAYOUT.LOCK_LINE_GAP_PX }}>
        <span style={{ fontSize: NP.LAYOUT.BOX.TITLE_PX, fontWeight: 600, color: colors.title }}>
          {NP.LABELS.EMPTY_TITLE}
        </span>
        <span style={{ fontSize: NP.LAYOUT.BOX.LINE_PX, color: colors.muted }}>
          {denied ? NP.LABELS.SHORT_DENY : NP.LABELS.SHORT_REQUIREMENT(level, scope)}
        </span>
      </div>
    </div>
  );
};

export default NoPermissionCard;
