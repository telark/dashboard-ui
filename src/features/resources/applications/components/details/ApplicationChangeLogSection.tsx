import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { formatDateKey, toDateKey } from '../../../../../utils/shared/time';
import SettingsCard from '../../../../settings/components/SettingsCard';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../components/display/table/RowTag';
import ApplicationSectionEmptyState from '../display/ApplicationSectionEmptyState';
import { APPLICATION_CHANGE_CLASS, APPLICATIONS_UI } from '../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import { getChangeLogDotColor } from '../../pages/details/contentBlocks';
import { useUsernamesByIds } from '../../hooks/useUsernamesByIds';
import type { Application, ApplicationChangeLogEntry } from '../../models';

const MAX_ENTRIES = 20;
const MAX_CHANGES = 5;

const ChangeRow: React.FC<{
  entry: ApplicationChangeLogEntry;
  usernamesById: Record<string, string>;
}> = ({ entry, usernamesById }) => {
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
              background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
              color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
              fontSize={11}
            />
            <RowTag
              text={entry.changeClass}
              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
            />
            <RowTag
              text={`severity: ${entry.severity}`}
              background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
              color={DEFAULT_COLORS.TEXT_SECONDARY}
              fontSize={11}
            />
            {suffix ? (
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {suffix.trim()}
              </span>
            ) : null}
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
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                  fontSize={11}
                  capitalize={false}
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

          {entry.changes?.length ? (
            <div style={{ marginTop: 8 }}>
              {entry.changes.slice(0, MAX_CHANGES).map((c, idx) => {
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
              {entry.changes.length > MAX_CHANGES ? (
                <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, marginTop: 4 }}>
                  {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SHOWING_FIRST} {MAX_CHANGES} of{' '}
                  {entry.changes.length} changes.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div
          style={{
            fontSize: 12,
            color: DEFAULT_COLORS.TEXT_MUTED,
            flexShrink: 0,
            textAlign: 'right',
            lineHeight: 1.35,
          }}
        >
          <TimeAgo date={entry.detectedAt} />
        </div>
      </div>
    </div>
  );
};

const ApplicationChangeLogSection: React.FC<{ application: Application }> = memo(
  ({ application }) => {
    const changeLog = useMemo(
      () => application.history?.changeLog || [],
      [application.history?.changeLog],
    );

    const grouped = useMemo(() => {
      const lim = changeLog.slice(0, MAX_ENTRIES);
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
    }, [changeLog]);

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
                  />
                ))}
              </div>
            ))}
            {changeLog.length > MAX_ENTRIES ? (
              <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, paddingTop: 4 }}>
                {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SHOWING_FIRST} {MAX_ENTRIES} of{' '}
                {changeLog.length} entries.
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
