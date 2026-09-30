import React, { memo, useMemo, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../constants';
import { formatDateKey, toDateKey } from '../../../../utils/shared/time';
import SettingsCard from '../../../settings/components/SettingsCard';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import RowTag from '../../../../components/display/table/RowTag';
import TablePagination from '../../../../components/display/table/TablePagination';
import ApplicationSectionEmptyState from '../display/ApplicationSectionEmptyState';
import { APPLICATION_CHANGE_CLASS, APPLICATIONS_UI } from '../../constants';
import {
  APPLICATION_CHANGE_LOG_PAGE_SIZE,
  APPLICATION_TRACKING_ANNOTATION_PREFIX,
} from '../../constants/applications';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import { getChangeLogDotColor } from '../../pages/details/contentBlocks';
import { useUsernamesByIds } from '../../hooks/useUsernamesByIds';
import type { Application, ApplicationChangeLogEntry } from '../../models';

// The tracking annotations the policy engine stamps on every write are the
// source of "last modified"; as change rows they are noise.
const visibleChanges = (entry: ApplicationChangeLogEntry) =>
  (entry.changes ?? []).filter((c) => !c.field.includes(APPLICATION_TRACKING_ANNOTATION_PREFIX));

const CHANGE_LIST_VISIBLE_ROWS = 5;
const CHANGE_ROW_HEIGHT_PX = 26;
const SCROLL_HIDDEN_CLASS = 'tk-scroll-hidden';

// Shows five changes; the rest scroll under an invisible scrollbar, with a
// "more" affordance until the reader reaches the end.
const ChangeList: React.FC<{ count: number; children: React.ReactNode }> = ({
  count,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);
  const scrollable = count > CHANGE_LIST_VISIBLE_ROWS;
  const maxHeight = CHANGE_LIST_VISIBLE_ROWS * CHANGE_ROW_HEIGHT_PX;
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  };
  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        className={scrollable ? SCROLL_HIDDEN_CLASS : undefined}
        style={{ maxHeight: scrollable ? maxHeight : undefined }}
      >
        {children}
      </div>
      {scrollable && !atEnd ? (
        <Tooltip title={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SCROLL_FOR_MORE_TOOLTIP}>
          <button
            type="button"
            onClick={() => ref.current?.scrollBy({ top: maxHeight, behavior: 'smooth' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 4,
              padding: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              color: DEFAULT_COLORS.TEXT_MUTED,
            }}
          >
            <DownOutlined />
            {count - CHANGE_LIST_VISIBLE_ROWS} {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.MORE_CHANGES}
          </button>
        </Tooltip>
      ) : null}
    </div>
  );
};

const ChangeRow: React.FC<{
  entry: ApplicationChangeLogEntry;
  usernamesById: Record<string, string>;
  hasSnapshot: boolean;
}> = ({ entry, usernamesById, hasSnapshot }) => {
  const dotColor = getChangeLogDotColor(entry.changeClass);
  const actorId = entry.changedBy || '';
  const actorName = actorId ? usernamesById[actorId] : '';
  const suffixParts: string[] = [];
  if (entry.isIncident) suffixParts.push('Incident');
  if (entry.isRecovery) suffixParts.push('Recovery');
  if (entry.isLastOne) suffixParts.push('Latest');
  const suffix = suffixParts.length > 0 ? ` · ${suffixParts.join(' · ')}` : '';

  return (
    <div style={{ padding: '10px 0', borderBottom: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            marginTop: 5,
            flexShrink: 0,
            background: dotColor,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
            <RowTag
              text={`${APPLICATIONS_UI.SECTIONS.CHANGE_LOG.GEN}: ${entry.generation}`}
              fontSize={11}
            />
            <RowTag
              text={entry.changeClass}
              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
            />
            <RowTag text={`severity: ${entry.severity}`} fontSize={11} />
            <Tooltip
              title={
                hasSnapshot
                  ? APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SNAPSHOT_AVAILABLE_TOOLTIP
                  : APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SNAPSHOT_MISSING_TOOLTIP
              }
            >
              <span>
                <RowTag
                  text={
                    hasSnapshot
                      ? APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SNAPSHOT_AVAILABLE
                      : APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SNAPSHOT_MISSING
                  }
                  accent={hasSnapshot ? DEFAULT_COLORS.SUCCESS : undefined}
                  fontSize={11}
                />
              </span>
            </Tooltip>
            {suffix ? (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {suffix.trim()}
              </span>
            ) : null}
            {/* In the chip row, not a column of its own: on a narrow card it wraps under the chips. */}
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: DEFAULT_COLORS.TEXT_MUTED,
                whiteSpace: 'nowrap',
                lineHeight: 1.35,
              }}
            >
              <TimeAgo date={entry.detectedAt} />
            </span>
          </div>

          {actorId || entry.fingerprint ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 6,
                alignItems: 'center',
              }}
            >
              {actorName ? (
                <RowTag
                  text={`${APPLICATIONS_UI.SECTIONS.CHANGE_LOG.BY_PREFIX} ${actorName}`}
                  fontSize={11}
                  capitalize={false}
                  truncate
                />
              ) : null}
              {entry.fingerprint ? (
                <code
                  style={{
                    fontSize: 11,
                    fontFamily: 'monospace',
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                    background: DEFAULT_COLORS.SURFACE_ELEVATED_HOVER,
                    border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
                    borderRadius: 6,
                    padding: '2px 6px',
                  }}
                >
                  {entry.fingerprint}
                </code>
              ) : null}
            </div>
          ) : null}

          {visibleChanges(entry).length ? (
            <div style={{ marginTop: 8 }}>
              <ChangeList count={visibleChanges(entry).length}>
                {visibleChanges(entry).map((c, idx) => {
                  const hasOldValue = c.oldValue != null && String(c.oldValue).length > 0;
                  const hasNewValue = c.newValue != null && String(c.newValue).length > 0;
                  // A rollback has no old value to diff against, so the generic
                  // "field: value" form renders as "snapshot: snap-3415eeaa" and drops
                  // the generation it restored. The description already states both.
                  const preferDescription =
                    c.changeType === APPLICATION_CHANGE_CLASS.ROLLBACK && Boolean(c.description);
                  const rollbackText =
                    preferDescription && hasNewValue
                      ? c.description.replace(
                          `${APPLICATIONS_UI.SECTIONS.CHANGE_LOG.ROLLBACK_SNAPSHOT_JOINER}${String(c.newValue)}`,
                          '',
                        )
                      : c.description;
                  return (
                    <div
                      key={`${entry.fingerprint}:${idx}`}
                      style={{
                        fontSize: 12,
                        color: DEFAULT_COLORS.TEXT_PRIMARY,
                        lineHeight: 1.5,
                        marginTop: idx === 0 ? 0 : 6,
                      }}
                    >
                      {preferDescription ? (
                        rollbackText
                      ) : (
                        <>
                          <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{c.changeType}</span>{' '}
                          <span style={{ fontWeight: 700 }}>{c.field}</span>
                          {': '}
                          {hasOldValue ? (
                            <span
                              style={{
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                textDecoration: 'line-through',
                              }}
                            >
                              {String(c.oldValue)}
                            </span>
                          ) : null}
                          {hasOldValue && hasNewValue ? (
                            <span style={{ margin: '0 6px', color: DEFAULT_COLORS.TEXT_MUTED }}>
                              {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DIFF_ARROW}
                            </span>
                          ) : null}
                          {hasNewValue ? (
                            <span style={{ fontWeight: 700 }}>{String(c.newValue)}</span>
                          ) : !hasOldValue ? (
                            <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                              {c.description}
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                  );
                })}
              </ChangeList>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ApplicationChangeLogSection: React.FC<{ application: Application }> = memo(
  ({ application }) => {
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

    return (
      <SettingsCard
        collapsible
        title={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.TITLE}
        description={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DESCRIPTION}
      >
        {changeLog.length === 0 ? (
          <ApplicationSectionEmptyState
            description={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.EMPTY_DESCRIPTION}
          />
        ) : (
          <div>
            {grouped.map((group, groupIdx) => (
              <div key={group.dayKey}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginTop: groupIdx === 0 ? 0 : 12,
                    marginBottom: 8,
                    paddingBottom: 6,
                    borderBottom: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
                  }}
                >
                  {formatDateKey(group.dayKey)}
                </div>
                {group.entries.map((entry) => (
                  <ChangeRow
                    key={`${entry.generation}:${entry.fingerprint}`}
                    entry={entry}
                    usernamesById={usernamesById}
                    hasSnapshot={snapshotGenerations.has(entry.generation)}
                  />
                ))}
              </div>
            ))}
            {changeLog.length > APPLICATION_CHANGE_LOG_PAGE_SIZE ? (
              <div style={{ paddingTop: 12 }}>
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
      </SettingsCard>
    );
  },
);

ApplicationChangeLogSection.displayName = 'ApplicationChangeLogSection';

export default ApplicationChangeLogSection;
