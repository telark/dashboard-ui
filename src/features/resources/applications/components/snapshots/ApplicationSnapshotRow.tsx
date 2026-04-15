import React, { memo } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { APPLICATIONS_UI } from '../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import type { ApplicationSnapshotSummary } from '../../models';

const ICON_BTN: React.CSSProperties = {
  borderColor: DEFAULT_COLORS.BORDER_LIGHT,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
};

export interface ApplicationSnapshotRowProps {
  snapshot: ApplicationSnapshotSummary;
  showMarginBottom: boolean;
  onViewManifest: (summary: ApplicationSnapshotSummary) => void;
  onRollback?: (summary: ApplicationSnapshotSummary) => void;
  rollbackLoading?: boolean;
  rollbackDisabled?: boolean;
}

const ApplicationSnapshotRow: React.FC<ApplicationSnapshotRowProps> = memo(
  ({
    snapshot: s,
    showMarginBottom,
    onViewManifest,
    onRollback,
    rollbackLoading = false,
    rollbackDisabled = false,
  }) => {
    const severityLabel =
      s.severity && s.severity.trim().length > 0 ? s.severity : APPLICATIONS_UI.FALLBACKS.EMPTY;

    const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
    const takenAtLine =
      s.takenAt && s.takenAt.trim().length > 0 ? (
        <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 500 }}>
          {ui.TAKEN_AT}: <TimeAgo date={s.takenAt} />
        </span>
      ) : (
        <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 500 }}>
          {ui.TAKEN_AT}: {APPLICATIONS_UI.FALLBACKS.EMPTY}
        </span>
      );

    return (
      <div
        style={{
          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
          padding: 10,
          marginBottom: showMarginBottom ? 8 : 0,
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
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
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              minWidth: 0,
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                <RowTag
                  text={`${ui.GENERATION}: ${s.generation}`}
                  {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                />
                <RowTag
                  text={`${ui.SEVERITY}: ${severityLabel}`}
                  {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                />
                <RowTag
                  text={`${ui.SIZE}: ${s.size}`}
                  {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                />
              </div>
              {takenAtLine}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              alignSelf: 'flex-start',
            }}
          >
            <Tooltip title={ui.VIEW_MANIFEST}>
              <Button
                size="small"
                type="default"
                icon={<EyeOutlined />}
                onClick={() => onViewManifest(s)}
                style={ICON_BTN}
                aria-label={ui.VIEW_MANIFEST}
              />
            </Tooltip>
            <Tooltip
              title={
                rollbackDisabled ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : ui.ROLLBACK
              }
            >
              <Button
                size="small"
                type="default"
                icon={<Icons.SnapshotRestore size={14} />}
                onClick={() => onRollback?.(s)}
                style={ICON_BTN}
                aria-label={ui.ROLLBACK}
                loading={rollbackLoading}
                disabled={!onRollback || rollbackDisabled}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  },
);

ApplicationSnapshotRow.displayName = 'ApplicationSnapshotRow';

export default ApplicationSnapshotRow;
