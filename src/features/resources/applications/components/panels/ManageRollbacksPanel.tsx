import React, { useMemo, useState } from 'react';
import { Spin } from 'antd';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { DEFAULT_COLORS } from '../../../../../constants';
import type { Application, ApplicationRollbackEntry } from '../../models';
import { APPLICATIONS_UI } from '../../constants/texts';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../components/display/table/RowTag';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';

const PANEL_WIDTH = 650;
const PANEL_WIDTH_EXPANDED = 960;

export interface ManageRollbacksPanelProps {
  open: boolean;
  onClose: () => void;
  detailRollbacks: Application['rollbacks'];
}

const ManageRollbacksPanel: React.FC<ManageRollbacksPanelProps> = ({
  open,
  onClose,
  detailRollbacks,
}) => {
  const [expanded, setExpanded] = useState(false);
  const rollbacks = useMemo<ApplicationRollbackEntry[]>(
    () => (Array.isArray(detailRollbacks) ? detailRollbacks : []),
    [detailRollbacks],
  );

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS}
        subtitle="Rollback timeline and status"
        width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
        contentOnly
        headerExtra={
          <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
        }
        formContent={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rollbacks.length === 0 ? (
              <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>
                No rollbacks recorded for this application yet.
              </div>
            ) : (
              <div style={{ display: 'grid', rowGap: 10 }}>
                {rollbacks
                  .slice()
                  .sort((a, b) => String(b.triggeredAt).localeCompare(String(a.triggeredAt)))
                  .map((rb) => (
                    <RollbackRow key={rb.id} entry={rb} />
                  ))}
              </div>
            )}
          </div>
        }
      />
    </>
  );
};

ManageRollbacksPanel.displayName = 'ManageRollbacksPanel';

export default ManageRollbacksPanel;

function RollbackRow(props: { entry: ApplicationRollbackEntry }): React.ReactElement {
  const { entry } = props;
  const statusText = entry.status || 'unknown';
  const status = statusText.toLowerCase();
  const isFailed = status.includes('fail') || status.includes('error');
  const isCompleted = status.includes('success') || status.includes('complete');
  const isInProgress =
    !isFailed &&
    !isCompleted &&
    (status.includes('progress') ||
      status.includes('running') ||
      status.includes('pending') ||
      status.includes('started'));

  const statusTag = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <RowTag
        text={statusText}
        background={isFailed ? DEFAULT_COLORS.CHIP_CUSTOM_BG : DEFAULT_COLORS.CHIP_CUSTOM_BG}
        color={isFailed ? DEFAULT_COLORS.DANGER : DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
        fontSize={11}
      />
      {isInProgress ? <Spin size="small" /> : null}
    </span>
  );

  return (
    <div
      style={{
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
        padding: 10,
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_WHITE;
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <RowTag
              text={`Gen: ${entry.targetGeneration}`}
              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
            />
            <RowTag
              text={`NS: ${entry.namespace || APPLICATIONS_UI.FALLBACKS.EMPTY}`}
              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
            />
            {entry.restoredGeneration != null ? (
              <RowTag
                text={`Restored: ${entry.restoredGeneration}`}
                {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
              />
            ) : null}
            {statusTag}
          </div>
          <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 500 }}>
            Triggered: <TimeAgo date={entry.triggeredAt} />
            {entry.triggeredBy ? ` · ${entry.triggeredBy}` : ''}
            {entry.completedAt ? (
              <>
                {' '}
                · Completed: <TimeAgo date={entry.completedAt} />
              </>
            ) : null}
          </span>
          {entry.error ? (
            <span style={{ fontSize: 12, color: DEFAULT_COLORS.DANGER }}>{entry.error}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
