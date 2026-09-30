import React, { memo, useMemo } from 'react';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectPermissionsState } from '../../../auth/store/selectors/permissionsSelectors';
import { PERMISSION_LEVEL_RANK } from '../../../auth/models/permissions';
import type { PermissionLevel, ResolvedRole } from '../../../auth/models/permissions';
import { AUTH_PERMISSIONS_LABELS } from '../../../auth/constants';
import { getCurrentUser } from '../../../auth/utils';
import SettingsCard from '../../components/SettingsCard';
import { DEFAULT_COLORS, getPillSurface } from '../../../../constants';

const LEVEL_COLOR = DEFAULT_COLORS.TEXT_MUTED;

function getWinningRoleForScope(roles: ResolvedRole[], scopeName: string): ResolvedRole | null {
  let winner: { role: ResolvedRole; levelRank: number; priority: number } | null = null;
  for (const role of roles) {
    if (role.isExpired) continue;
    const entry =
      role.scopes.find((sp) => sp.scope === scopeName) ??
      role.scopes.find((sp) => sp.scope.toUpperCase() === 'ALL');
    if (!entry) continue;
    const rank = PERMISSION_LEVEL_RANK[entry.level];
    if (
      !winner ||
      rank > winner.levelRank ||
      (rank === winner.levelRank && role.priority > winner.priority)
    ) {
      winner = { role, levelRank: rank, priority: role.priority };
    }
  }
  return winner?.role ?? null;
}

function getWinningAllEntry(
  roles: ResolvedRole[],
): { level: PermissionLevel; rules: string[]; role: ResolvedRole } | null {
  let winner: {
    level: PermissionLevel;
    rules: string[];
    role: ResolvedRole;
    levelRank: number;
    priority: number;
  } | null = null;
  for (const role of roles) {
    if (role.isExpired) continue;
    const entry = role.scopes.find((sp) => sp.scope.toUpperCase() === 'ALL');
    if (!entry) continue;
    const rank = PERMISSION_LEVEL_RANK[entry.level];
    if (
      !winner ||
      rank > winner.levelRank ||
      (rank === winner.levelRank && role.priority > winner.priority)
    ) {
      winner = {
        level: entry.level,
        rules: entry.rules ?? [],
        role,
        levelRank: rank,
        priority: role.priority,
      };
    }
  }
  return winner ? { level: winner.level, rules: winner.rules, role: winner.role } : null;
}

function formatSources(role: ResolvedRole): string {
  if (role.sources.length === 0) return '—';
  return role.sources
    .map((src) =>
      src.kind === 'direct'
        ? AUTH_PERMISSIONS_LABELS.SOURCE_DIRECT
        : AUTH_PERMISSIONS_LABELS.SOURCE_INHERITED(src.groupName),
    )
    .join(', ');
}

interface ScopeRowProps {
  title: string;
  level: PermissionLevel;
  rules: string[];
  sourceText: string;
}

const ScopeRow: React.FC<ScopeRowProps> = memo(({ title, level, rules, sourceText }) => (
  <div style={{ marginBottom: 8 }}>
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
        {title}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            ...getPillSurface(LEVEL_COLOR),
            borderRadius: 4,
            padding: '2px 7px',
          }}
        >
          {level}
        </span>
        <Tooltip
          title={
            sourceText === AUTH_PERMISSIONS_LABELS.SOURCE_DIRECT
              ? AUTH_PERMISSIONS_LABELS.SOURCE_DIRECT_TOOLTIP
              : AUTH_PERMISSIONS_LABELS.SOURCE_INHERITED_TOOLTIP
          }
          placement="top"
        >
          <span
            style={{
              fontSize: 12,
              color: DEFAULT_COLORS.TEXT_MUTED,
              cursor: 'help',
            }}
          >
            {sourceText}
          </span>
        </Tooltip>
      </div>
    </div>
    {rules.length > 0 && (
      <div style={{ marginTop: 4, fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
        <span style={{ fontWeight: 500, color: DEFAULT_COLORS.TEXT_SECONDARY }}>Deny: </span>
        {rules.join(', ')}
      </div>
    )}
  </div>
));

ScopeRow.displayName = 'ScopeRow';

const MyPermissionsSectionContent: React.FC = memo(() => {
  const { roles, scopeIndex } = useSelector(selectPermissionsState);

  const hasActiveRoles = useMemo(
    () => roles.length > 0 && roles.some((r) => !r.isExpired),
    [roles],
  );

  const allEntry = useMemo(() => getWinningAllEntry(roles), [roles]);

  const scopeRows = useMemo(
    () =>
      Object.entries(scopeIndex).map(([scope, { level, rules }]) => {
        const winningRole = getWinningRoleForScope(roles, scope);
        return {
          scope,
          level,
          rules,
          sourceText: winningRole != null ? formatSources(winningRole) : '—',
        };
      }),
    [scopeIndex, roles],
  );

  if (getCurrentUser()?.bootstrap === true) {
    return (
      <SettingsCard title={AUTH_PERMISSIONS_LABELS.FULL_ACCESS_TITLE}>
        <p style={{ margin: 0, fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {AUTH_PERMISSIONS_LABELS.FULL_ACCESS_DESCRIPTION}
        </p>
      </SettingsCard>
    );
  }

  if (!hasActiveRoles) {
    return (
      <SettingsCard title={AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_TITLE}>
        <p style={{ margin: 0, fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_DESCRIPTION}
        </p>
      </SettingsCard>
    );
  }

  const allRows: { title: string; level: PermissionLevel; rules: string[]; sourceText: string }[] =
    [];
  if (allEntry != null) {
    allRows.push({
      title: 'All Scopes',
      level: allEntry.level,
      rules: allEntry.rules,
      sourceText: formatSources(allEntry.role),
    });
  }
  for (const { scope, level, rules, sourceText } of scopeRows) {
    allRows.push({
      title: scope.charAt(0).toUpperCase() + scope.slice(1),
      level,
      rules,
      sourceText,
    });
  }

  return (
    <SettingsCard title="Effective Permissions">
      {allRows.map((row) => (
        <ScopeRow
          key={row.title}
          title={row.title}
          level={row.level}
          rules={row.rules}
          sourceText={row.sourceText}
        />
      ))}
    </SettingsCard>
  );
});

MyPermissionsSectionContent.displayName = 'MyPermissionsSectionContent';

export default MyPermissionsSectionContent;
