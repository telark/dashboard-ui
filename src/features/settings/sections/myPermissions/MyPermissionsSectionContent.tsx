import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPermissionsState } from '../../../auth/store/selectors/permissionsSelectors';
import { PERMISSION_LEVEL_RANK } from '../../../auth/models/permissions';
import type { PermissionLevel, ResolvedRole } from '../../../auth/models/permissions';
import { AUTH_PERMISSIONS_LABELS } from '../../../auth/constants';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { DEFAULT_COLORS } from '../../../../constants';

const { CONTENT } = SETTINGS_CONSTANTS;

const LEVEL_COLOR: Record<PermissionLevel, string> = {
  ReadOnly: DEFAULT_COLORS.TEXT_MUTED,
  Contributor: '#3b82f6',
  Owner: DEFAULT_COLORS.SUCCESS,
  Admin: '#f97316',
};

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
    .map((src) => (src.kind === 'direct' ? 'Direct' : `Inherited from ${src.groupID}`))
    .join(', ');
}

interface ScopeBlockProps {
  title: string;
  level: PermissionLevel;
  rules: string[];
  sourceText: string;
}

const ScopeBlock: React.FC<ScopeBlockProps> = memo(({ title, level, rules, sourceText }) => (
  <SettingsCard
    title={title}
    headerAction={
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: LEVEL_COLOR[level],
          background: `${LEVEL_COLOR[level]}1a`,
          borderRadius: 4,
          padding: '2px 8px',
        }}
      >
        {level}
      </span>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {rules.length > 0 && (
        <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>
          <span style={{ fontWeight: 500, color: DEFAULT_COLORS.TEXT_SECONDARY }}>Deny: </span>
          {rules.join(', ')}
        </div>
      )}
      <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>
        <span style={{ fontWeight: 500, color: DEFAULT_COLORS.TEXT_SECONDARY }}>Source: </span>
        {sourceText}
      </div>
    </div>
  </SettingsCard>
));

ScopeBlock.displayName = 'ScopeBlock';

const MyPermissionsSectionContent: React.FC = memo(() => {
  const { roles, scopeIndex } = useSelector(selectPermissionsState);

  const hasActiveRoles = useMemo(
    () => roles.length > 0 && roles.some((r) => !r.isExpired),
    [roles],
  );

  const allEntry = useMemo(() => getWinningAllEntry(roles), [roles]);

  const scopeBlocks = useMemo(
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

  if (!hasActiveRoles) {
    return (
      <SettingsCard title={AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_TITLE}>
        <p style={{ margin: 0, fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_DESCRIPTION}
        </p>
      </SettingsCard>
    );
  }

  return (
    <>
      {allEntry != null && (
        <ScopeBlock
          title="All Scopes"
          level={allEntry.level}
          rules={allEntry.rules}
          sourceText={formatSources(allEntry.role)}
        />
      )}
      {scopeBlocks.map(({ scope, level, rules, sourceText }, index) => (
        <div
          key={scope}
          style={
            index > 0 || allEntry != null ? { marginTop: CONTENT.GAP_BETWEEN_CARDS } : undefined
          }
        >
          <ScopeBlock
            title={scope.charAt(0).toUpperCase() + scope.slice(1)}
            level={level}
            rules={rules}
            sourceText={sourceText}
          />
        </div>
      ))}
    </>
  );
});

MyPermissionsSectionContent.displayName = 'MyPermissionsSectionContent';

export default MyPermissionsSectionContent;
