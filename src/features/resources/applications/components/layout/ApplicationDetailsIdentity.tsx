import React, { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_DETAILS_TOOLBAR } from '../../constants/sectionLayout';
import { getApplicationHealthAccentColor } from '../../utils/healthVisual';
import type { Application } from '../../models';

const T = APPLICATION_DETAILS_TOOLBAR;
const LABELS = APPLICATIONS_UI.SECTIONS.DETAILS_TOOLBAR;

// A flex item's shrink amount is proportional to flex-basis × flex-shrink, so an
// enormous shrink factor makes the meta text absorb virtually all the deficit
// before the name gives up any width — no pixel threshold to calibrate, and it
// reacts correctly to any width (a docked half-screen browser included).
const META_SHRINK_PRIORITY = 100000;

interface ApplicationDetailsIdentityProps {
  application: Application;
  /** True once the page header has scrolled away; the strip is redundant before that. */
  visible: boolean;
}

/**
 * Keeps the application's name, health and sync age visible in the sticky
 * toolbar once the page header has scrolled out of view. The meta text (health
 * status, sync age) is the first thing to give up space when it gets tight —
 * the dot already carries health — and disappears entirely before the name
 * loses any of its own width.
 */
const ApplicationDetailsIdentity: React.FC<ApplicationDetailsIdentityProps> = memo(
  ({ application, visible }) => {
    const healthStatus = application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN;
    const lastSyncedAt = application.lastForceSync?.completedAt;

    return (
      <AnimatePresence initial={false}>
        {visible ? (
          <motion.div
            key="identity"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: T.REVEAL_DURATION_S, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: T.IDENTITY_GAP_PX,
              minWidth: 0,
            }}
          >
            <span
              style={{
                width: T.HEALTH_DOT_SIZE_PX,
                height: T.HEALTH_DOT_SIZE_PX,
                borderRadius: '50%',
                background: getApplicationHealthAccentColor(application.health?.status),
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: T.NAME_FONT_SIZE_PX,
                fontWeight: 700,
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
              {application.name}
            </span>
            <span
              style={{
                fontSize: T.META_FONT_SIZE_PX,
                color: DEFAULT_COLORS.TEXT_MUTED,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                flexShrink: META_SHRINK_PRIORITY,
              }}
            >
              {LABELS.SEPARATOR} {healthStatus} {LABELS.SEPARATOR}{' '}
              {lastSyncedAt ? (
                <>
                  {LABELS.SYNCED_PREFIX} <TimeAgo date={lastSyncedAt} />
                </>
              ) : (
                LABELS.NEVER_SYNCED
              )}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  },
);

ApplicationDetailsIdentity.displayName = 'ApplicationDetailsIdentity';

export default ApplicationDetailsIdentity;
