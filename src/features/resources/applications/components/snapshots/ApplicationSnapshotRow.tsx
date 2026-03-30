import React, { memo } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import { APPLICATIONS_UI } from '../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import type { ApplicationSnapshotSummary } from '../../models';

export interface ApplicationSnapshotRowProps {
  snapshot: ApplicationSnapshotSummary;
  showMarginBottom: boolean;
  onViewManifest: (snapshotId: string) => void;
  onRollback?: (snapshotId: string) => void;
}

const ApplicationSnapshotRow: React.FC<ApplicationSnapshotRowProps> = memo(
  ({ snapshot: s, showMarginBottom, onViewManifest, onRollback }) => {
    const truncatedId = s.id.length > 24 ? `${s.id.slice(0, 10)}…${s.id.slice(-10)}` : s.id;

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
              alignItems: 'flex-start',
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
                marginTop: 6,
                flexShrink: 0,
                background: DEFAULT_COLORS.SUCCESS,
              }}
              aria-hidden
            />
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  {APPLICATIONS_UI.SECTIONS.SNAPSHOTS.SNAPSHOT_ID}
                </span>
                <Tooltip title={s.id}>
                  <code
                    style={{
                      fontSize: 12,
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                      background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                      padding: '2px 8px',
                      borderRadius: 6,
                      border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                    }}
                  >
                    {truncatedId}
                  </code>
                </Tooltip>
                <RowTag
                  text={`${APPLICATIONS_UI.SECTIONS.SNAPSHOTS.SIZE}: ${s.size}`}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                  fontSize={11}
                />
              </div>
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
