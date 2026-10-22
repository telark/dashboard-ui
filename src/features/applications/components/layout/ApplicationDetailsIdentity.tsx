import React, { memo } from 'react';
import { DEFAULT_COLORS, FONT_WEIGHT } from '../../../../constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_DETAILS_TOOLBAR } from '../../constants/sectionLayout';
import ApplicationHealthIndicator from '../display/ApplicationHealthIndicator';
import type { Application } from '../../models';

const T = APPLICATION_DETAILS_TOOLBAR;
const LABELS = APPLICATIONS_UI.SECTIONS.DETAILS_TOOLBAR;

// A flex item's shrink amount is proportional to flex-basis × flex-shrink, so an
// enormous shrink factor makes the meta text absorb virtually all the deficit
// before the name gives up any width — no pixel threshold to calibrate, and it
// reacts correctly to any width (a docked half-screen browser included).
const META_SHRINK_PRIORITY = 100000;

const isStale = (date: string): boolean => Date.now() - new Date(date).getTime() > T.SYNC_STALE_MS;

/**
 * Keeps the application's name, health and sync age visible in the sticky
 * strip once the page header has scrolled out of view. The meta (health, sync
 * age) is the first thing to give up space when it gets tight, and disappears
 * entirely before the name loses any of its own width.
 */
const ApplicationDetailsIdentity: React.FC<{ application: Application }> = memo(
  ({ application }) => {
    const lastSyncedAt = application.lastForceSync?.completedAt;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: T.IDENTITY_GAP_PX, minWidth: 0 }}>
        <span
          style={{
            fontSize: T.NAME_FONT_SIZE_PX,
            fontWeight: FONT_WEIGHT.BOLD,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            // A flex item's default min-width is its content's, which for
            // nowrap text is the full unwrapped width — so without this the
            // name never actually shrinks and the ellipsis never engages.
            minWidth: 0,
            flexShrink: 1,
          }}
        >
          {application.displayName || application.name}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: T.IDENTITY_GAP_PX,
            fontSize: T.META_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_MUTED,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            minWidth: 0,
            flexShrink: META_SHRINK_PRIORITY,
          }}
        >
          <ApplicationHealthIndicator status={application.health?.status} />
          <span>{LABELS.SEPARATOR}</span>
          {lastSyncedAt ? (
            <span style={isStale(lastSyncedAt) ? { color: DEFAULT_COLORS.WARNING } : undefined}>
              {LABELS.SYNCED_PREFIX} <TimeAgo date={lastSyncedAt} short />
            </span>
          ) : (
            <span>{LABELS.NEVER_SYNCED}</span>
          )}
        </span>
      </div>
    );
  },
);

ApplicationDetailsIdentity.displayName = 'ApplicationDetailsIdentity';

export default ApplicationDetailsIdentity;
