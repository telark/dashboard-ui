import React, { memo, useCallback, useMemo, useState } from 'react';
import { Empty, Typography } from 'antd';
import {
  DEFAULT_COLORS,
  EMPTY_CLASS,
  SECTION_LAYOUT,
  TIME_FORMATS,
  LINE_HEIGHT,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
} from '../../../../constants';
import { formatDateKey, toDateKey } from '../../../../utils/shared/time';
import SettingsCard from '../../../settings/components/SettingsCard';
import TablePagination from '../../../../components/display/table/TablePagination';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_CHANGE_LOG_PAGE_SIZE } from '../../constants/applications';
import { useUsernamesByIds } from '../../../../hooks/useUsernamesByIds';
import type { Application, ApplicationChangeLogEntry } from '../../models';
import ChangeRow from './changelog/ChangeRow';
import ChangeEntryPanel from './changelog/ChangeEntryPanel';
import type { RollbackDisabledReason } from '../snapshots/ApplicationSnapshotRow';
import { ACTION_PERMISSIONS, usePermission } from '../../../auth/hooks';

const { rollback } = ACTION_PERMISSIONS.applications;
const SNAPSHOT_UI = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

// The snapshot row's reasons, so "Roll back to this" is blocked exactly when the panel's button is.
const rollbackBlockedReason = (
  canRollback: boolean,
  reason: RollbackDisabledReason,
): string | undefined => {
  if (!canRollback) return SNAPSHOT_UI.ROLLBACK_PERMISSION_DENIED_TOOLTIP;
  if (reason === 'activeRollback') return SNAPSHOT_UI.ROLLBACK_IN_PROGRESS_TOOLTIP;
  if (reason === 'sync') return APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP;
  return undefined;
};

interface ApplicationChangeLogSectionProps {
  application: Application;
  rollbackDisabledReason: RollbackDisabledReason;
  onRollbackTo: (generation: number) => void;
}

const ApplicationChangeLogSection: React.FC<ApplicationChangeLogSectionProps> = memo(
  ({ application, rollbackDisabledReason, onRollbackTo }) => {
    const canRollback = usePermission(rollback.scope, rollback.level, rollback.deny);
    const blockedReason = rollbackBlockedReason(canRollback, rollbackDisabledReason);
    // Newest first: the CR appends, so the interesting entries sit at the end.
    const changeLog = useMemo(
      () => [...(application.history?.changeLog || [])].reverse(),
      [application.history?.changeLog],
    );
    const [page, setPage] = useState(1);
    const snapshotGenerations = useMemo(
      () => new Set((application.snapshots ?? []).map((s) => s.generation)),
      [application.snapshots],
    );
    const pageCount = Math.max(1, Math.ceil(changeLog.length / APPLICATION_CHANGE_LOG_PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);

    const grouped = useMemo(() => {
      const start = (currentPage - 1) * APPLICATION_CHANGE_LOG_PAGE_SIZE;
      const lim = changeLog.slice(start, start + APPLICATION_CHANGE_LOG_PAGE_SIZE);
      const groups: { dayKey: string; entries: ApplicationChangeLogEntry[] }[] = [];
      for (const e of lim) {
        const dayKey = toDateKey(e.detectedAt);
        const last = groups[groups.length - 1];
        if (!last || last.dayKey !== dayKey) {
          groups.push({ dayKey, entries: [e] });
        } else {
          last.entries.push(e);
        }
      }
      return groups;
    }, [changeLog, currentPage]);

    const actorIds = useMemo(
      () => changeLog.map((entry) => entry.changedBy).filter((id): id is string => Boolean(id)),
      [changeLog],
    );
    const usernamesById = useUsernamesByIds(actorIds, true);
    const [openEntry, setOpenEntry] = useState<ApplicationChangeLogEntry | null>(null);
    const closePanel = useCallback(() => setOpenEntry(null), []);
    const actorNameOf = (entry: ApplicationChangeLogEntry | null) =>
      entry?.changedBy ? usernamesById[entry.changedBy] : '';

    return (
      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.TITLE}
        description={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DESCRIPTION}
      >
        {changeLog.length === 0 ? (
          <Empty
            className={EMPTY_CLASS.SECTION}
            image={false}
            description={
              <Typography.Text style={{ lineHeight: LINE_HEIGHT.BASE }}>
                {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.EMPTY_DESCRIPTION}
              </Typography.Text>
            }
          />
        ) : (
          <div>
            {grouped.map((group, groupIdx) => (
              <div key={group.dayKey}>
                <div
                  style={{
                    fontSize: FONT_SIZE.SM,
                    fontWeight: FONT_WEIGHT.BOLD,
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    marginTop: groupIdx === 0 ? SPACING.NONE : SPACING.MD,
                    marginBottom: SPACING.SM,
                    paddingBottom: SPACING.S6,
                    borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
                  }}
                >
                  {formatDateKey(group.dayKey, TIME_FORMATS.SHORT)}
                </div>
                {group.entries.map((entry) => (
                  <ChangeRow
                    key={`${entry.generation}:${entry.fingerprint}`}
                    entry={entry}
                    actorName={actorNameOf(entry)}
                    hasSnapshot={snapshotGenerations.has(entry.generation)}
                    onOpen={setOpenEntry}
                    rollbackBlockedReason={blockedReason}
                    onRollbackTo={onRollbackTo}
                  />
                ))}
              </div>
            ))}
            {changeLog.length > APPLICATION_CHANGE_LOG_PAGE_SIZE ? (
              <div style={{ paddingTop: SPACING.MD }}>
                <TablePagination
                  config={{
                    currentPage,
                    pageSize: APPLICATION_CHANGE_LOG_PAGE_SIZE,
                    total: changeLog.length,
                    onPageChange: setPage,
                  }}
                />
              </div>
            ) : null}
          </div>
        )}
        <ChangeEntryPanel
          entry={openEntry}
          actorName={actorNameOf(openEntry)}
          onClose={closePanel}
        />
      </SettingsCard>
    );
  },
);

ApplicationChangeLogSection.displayName = 'ApplicationChangeLogSection';

export default ApplicationChangeLogSection;
