import React, { memo } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import { APPLICATION_DETAILS_CONSTANTS, APPLICATIONS_UI } from '../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import type { ApplicationSnapshotSummary } from '../../models';

const SNAPSHOT_TAG = APPLICATION_DETAILS_CONSTANTS.OVERVIEW_TAG_SUCCESS;

export interface ApplicationSnapshotRowProps {
  snapshot: ApplicationSnapshotSummary;
  showMarginBottom: boolean;
  onViewManifest: (snapshotId: string) => void;
  onRollback?: (snapshotId: string) => void;
}

const ApplicationSnapshotRow: React.FC<ApplicationSnapshotRowProps> = memo(
  ({ snapshot: s, showMarginBottom, onViewManifest, onRollback }) => {
    const severityLabel =
      s.severity && s.severity.trim().length > 0
        ? s.severity
        : APPLICATIONS_UI.FALLBACKS.EMPTY;

    return (
      <div
        style={{
          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
          padding: 10,
          marginBottom: showMarginBottom ? 8 : 0,
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
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                background: DEFAULT_COLORS.SUCCESS,
              }}
              aria-hidden
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <RowTag
                text={`${APPLICATIONS_UI.SECTIONS.SNAPSHOTS.GENERATION}: ${s.generation}`}
                background={SNAPSHOT_TAG.background}
                color={SNAPSHOT_TAG.color}
                fontSize={11}
              />
              <RowTag
                text={`${APPLICATIONS_UI.SECTIONS.SNAPSHOTS.SEVERITY}: ${severityLabel}`}
                background={SNAPSHOT_TAG.background}
                color={SNAPSHOT_TAG.color}
                fontSize={11}
              />
              <RowTag
                text={`${APPLICATIONS_UI.SECTIONS.SNAPSHOTS.SIZE}: ${s.size}`}
                background={SNAPSHOT_TAG.background}
                color={SNAPSHOT_TAG.color}
                fontSize={11}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewManifest(s.id)}
              style={{
                borderColor: DEFAULT_COLORS.BORDER_LIGHT,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
              }}
            >
              {APPLICATIONS_UI.SECTIONS.SNAPSHOTS.VIEW_MANIFEST}
            </Button>
            <Button
              size="small"
              icon={<Icons.SnapshotRestore size={14} />}
              onClick={() => onRollback?.(s.id)}
              style={{
                borderColor: DEFAULT_COLORS.BORDER_LIGHT,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
              }}
            >
              {APPLICATIONS_UI.SECTIONS.SNAPSHOTS.ROLLBACK}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

ApplicationSnapshotRow.displayName = 'ApplicationSnapshotRow';

export default ApplicationSnapshotRow;
