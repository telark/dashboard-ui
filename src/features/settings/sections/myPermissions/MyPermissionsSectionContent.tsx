import React, { memo, useMemo } from 'react';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectPermissionsState } from '../../../auth/store/selectors/permissionsSelectors';
import { PERMISSION_LEVEL_RANK } from '../../../auth/models/permissions';
import type { PermissionLevel, ResolvedRole } from '../../../auth/models/permissions';
import { AUTH_PERMISSIONS_LABELS } from '../../../auth/constants';
import { getCurrentUser } from '../../../auth/utils';
import SettingsCard from '../../components/SettingsCard';
import {
  DEFAULT_COLORS,
  EMPTY_VALUE,
  getPillSurface,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from '../../../../constants';
import { SCOPE_LABELS } from '../../../../components/shared';
import { denyRuleSentence } from '../../../access-and-permissions/roles/constants';

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
  if (role.sources.length === 0) return EMPTY_VALUE;
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
  <div style={{ marginBottom: SPACING.SM }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: SPACING.MD,
      }}
    >
      <span
        style={{
          fontSize: FONT_SIZE.MD,
          fontWeight: FONT_WEIGHT.SEMIBOLD,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
        }}
      >
        {title}
      </span>
      <div
        style={{
          // Off scale, kept exact: gap 10 (SM to MD).
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            // Off scale, kept exact: padding 7 (S6 to SM).
            fontSize: FONT_SIZE.XS,
            fontWeight: FONT_WEIGHT.SEMIBOLD,
            ...getPillSurface(LEVEL_COLOR),
            borderRadius: RADIUS.XS,
            padding: `${SPACING.XXS}px 7px`,
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
              fontSize: FONT_SIZE.SM,
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
      <div
        style={{ marginTop: SPACING.XS, fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}
      >
        {rules.map((rule) => (
          <div key={rule}>{denyRuleSentence(rule)}</div>
        ))}
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
          sourceText: winningRole != null ? formatSources(winningRole) : EMPTY_VALUE,
        };
      }),
    [scopeIndex, roles],
  );

  if (getCurrentUser()?.bootstrap === true) {
    return (
      <SettingsCard title={AUTH_PERMISSIONS_LABELS.FULL_ACCESS_TITLE}>
        <p
          style={{
            margin: SPACING.NONE,
            fontSize: FONT_SIZE.BASE,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          {AUTH_PERMISSIONS_LABELS.FULL_ACCESS_DESCRIPTION}
        </p>
      </SettingsCard>
    );
  }

  if (!hasActiveRoles) {
    return (
      <SettingsCard title={AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_TITLE}>
        <p
          style={{
            margin: SPACING.NONE,
            fontSize: FONT_SIZE.BASE,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          {AUTH_PERMISSIONS_LABELS.NO_PERMISSIONS_DESCRIPTION}
        </p>
      </SettingsCard>
    );
  }

  const allRows: { title: string; level: PermissionLevel; rules: string[]; sourceText: string }[] =
    [];
  if (allEntry != null) {
    allRows.push({
      title: AUTH_PERMISSIONS_LABELS.ALL_SCOPES_TITLE,
      level: allEntry.level,
      rules: allEntry.rules,
      sourceText: formatSources(allEntry.role),
    });
  }
  for (const { scope, level, rules, sourceText } of scopeRows) {
    allRows.push({
      title: SCOPE_LABELS[scope] ?? scope,
      level,
      rules,
      sourceText,
    });
  }

  return (
    <SettingsCard title={AUTH_PERMISSIONS_LABELS.EFFECTIVE_PERMISSIONS_TITLE}>
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
