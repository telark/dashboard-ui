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

interface ApplicationDetailsIdentityProps {
  application: Application;
  /** True once the page header has scrolled away; the strip is redundant before that. */
  visible: boolean;
}

/**
 * Keeps the application's name, health and sync age visible in the sticky
 * toolbar once the page header has scrolled out of view.
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
              }}
            >
              {application.name}
            </span>
            <span
              style={{
                fontSize: T.META_FONT_SIZE_PX,
                color: DEFAULT_COLORS.TEXT_MUTED,
                whiteSpace: 'nowrap',
                flexShrink: 0,
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
