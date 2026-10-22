import React from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { DatabaseOutlined, EyeOutlined, HistoryOutlined } from '@ant-design/icons';
import {
  BUTTON_COLORS,
  DEFAULT_COLORS,
  ROW_ICON_BUTTON_SIZE,
  SECTION_LAYOUT,
  STATUS_COLORS,
  STATUS_DOT,
  TRUNCATE_STYLE,
  getPillColor,
  SPACING,
  FONT_SIZE,
  LINE_HEIGHT,
} from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { APPLICATIONS_UI } from '../../../constants';
import { getChangeLogDotColor } from '../../../pages/details/contentBlocks';
import type { ApplicationChangeLogEntry } from '../../../models';
import ChangeList from './ChangeList';
import { visibleChanges } from './utils';

const CL = APPLICATIONS_UI.SECTIONS.CHANGE_LOG;

const ROW_ICON_STYLE: React.CSSProperties = {
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
  color: BUTTON_COLORS.MUTED_TEXT,
};

// Quiet on purpose: severity is the one colored chip in the row.
const SnapshotMarker: React.FC<{ hasSnapshot: boolean }> = ({ hasSnapshot }) => (
  <Tooltip title={hasSnapshot ? CL.SNAPSHOT_AVAILABLE_TOOLTIP : CL.SNAPSHOT_MISSING_TOOLTIP}>
    <span
      tabIndex={0}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: SPACING.XS,
        fontSize: FONT_SIZE.SM,
        color: DEFAULT_COLORS.TEXT_MUTED,
      }}
    >
      <DatabaseOutlined aria-hidden />
      {hasSnapshot ? CL.SNAPSHOT_AVAILABLE : CL.SNAPSHOT_MISSING}
    </span>
  </Tooltip>
);

const ChangeRow: React.FC<{
  entry: ApplicationChangeLogEntry;
  actorName: string;
  hasSnapshot: boolean;
  onOpen: (entry: ApplicationChangeLogEntry) => void;
  /** Why "Roll back to this" is disabled, or undefined when it is allowed. */
  rollbackBlockedReason: string | undefined;
  onRollbackTo: (generation: number) => void;
}> = ({ entry, actorName, hasSnapshot, onOpen, rollbackBlockedReason, onRollbackTo }) => {
  const dotColor = getChangeLogDotColor(entry);
  const changes = visibleChanges(entry);
  const suffixParts: string[] = [];
  if (entry.isIncident) suffixParts.push('Incident');
  if (entry.isRecovery) suffixParts.push('Recovery');
  if (entry.isLastOne) suffixParts.push('Latest');
  const suffix = suffixParts.length > 0 ? ` · ${suffixParts.join(' · ')}` : '';

  return (
    <div
      // 10: the row padding sits between SM and MD.
      style={{ padding: '10px 0', borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER }}
    >
      <div
        style={{
          display: 'flex',
          gap: SPACING.MD,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div
          // 5: drops the dot to the middle of the first text line.
          style={{ ...STATUS_DOT, marginTop: 5, background: dotColor }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SPACING.S6 }}>
            <Tag>{entry.changeClass}</Tag>
            <Tag color={getPillColor(STATUS_COLORS.APPLICATION_CHANGE_SEVERITY[entry.severity])}>
              {`${CL.SEVERITY}: ${entry.severity}`}
            </Tag>
            <SnapshotMarker hasSnapshot={hasSnapshot} />
            {suffix ? (
              <span style={{ fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {suffix.trim()}
              </span>
            ) : null}
            {/* In the chip row, not a column of its own: on a narrow card it wraps under the chips. */}
            <span
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: SPACING.XXS,
                fontSize: FONT_SIZE.SM,
                color: DEFAULT_COLORS.TEXT_MUTED,
                whiteSpace: 'nowrap',
                lineHeight: LINE_HEIGHT.SNUG,
                maxWidth: '100%',
                minWidth: 0,
              }}
            >
              <TimeAgo date={entry.detectedAt} short />
              {actorName ? (
                <span
                  title={entry.changedBy ?? undefined}
                  style={{ ...TRUNCATE_STYLE, marginLeft: SPACING.XS }}
                >
                  {`${CL.META_SEPARATOR} ${CL.BY_PREFIX} ${actorName}`}
                </span>
              ) : null}
              {hasSnapshot ? (
                <Tooltip title={rollbackBlockedReason ?? CL.ROLL_BACK_TO_THIS}>
                  <Button
                    type="text"
                    icon={<HistoryOutlined />}
                    aria-label={CL.ROLL_BACK_TO_THIS}
                    disabled={rollbackBlockedReason != null}
                    onClick={() => onRollbackTo(entry.generation)}
                    style={{ ...ROW_ICON_STYLE, marginLeft: SPACING.XS }}
                  />
                </Tooltip>
              ) : null}
              <Tooltip title={CL.OPEN_CHANGE}>
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  aria-label={CL.OPEN_CHANGE}
                  onClick={() => onOpen(entry)}
                  style={
                    hasSnapshot ? ROW_ICON_STYLE : { ...ROW_ICON_STYLE, marginLeft: SPACING.XS }
                  }
                />
              </Tooltip>
            </span>
          </div>

          {changes.length ? (
            <div style={{ marginTop: SPACING.SM }}>
              <ChangeList changes={changes} keyPrefix={entry.fingerprint} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChangeRow;
