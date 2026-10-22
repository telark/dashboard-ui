import React, { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DEFAULT_COLORS, HEADER_LAYOUT, LIST_TOOLBAR, SPACING } from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import type { Application } from '../../models';
import {
  APPLICATION_DETAILS_TOOLBAR,
  APPLICATION_SECTION_LAYOUT,
} from '../../constants/sectionLayout';
import ApplicationDetailsIdentity from '../../components/layout/ApplicationDetailsIdentity';
import ApplicationOverviewSection from '../../components/details/ApplicationOverviewSection';
import ApplicationResourcesSection from '../../components/details/ApplicationResourcesSection';
import ApplicationWorkloadMetricsSection from '../../components/details/ApplicationWorkloadMetricsSection';
import ApplicationChangeLogSection from '../../components/details/ApplicationChangeLogSection';
import type { RollbackDisabledReason } from '../../components/snapshots/ApplicationSnapshotRow';

const T = APPLICATION_DETAILS_TOOLBAR;

interface ApplicationDetailsContentProps {
  application: Application;
  actions: React.ReactNode;
  rollbackDisabledReason: RollbackDisabledReason;
  onRollbackTo: (generation: number) => void;
}

// Thin orchestrator: each section owns its own data and rendering. This keeps the
// details page a readable list of sections rather than a single monolith.
const ApplicationDetailsContent: React.FC<ApplicationDetailsContentProps> = memo(
  ({ application, actions, rollbackDisabledReason, onRollbackTo }) => {
    // The identity only earns its space once the page header is gone. A sentinel +
    // observer works whichever ancestor owns the scroll.
    const revealSentinelRef = useRef<HTMLDivElement>(null);
    const [identityVisible, setIdentityVisible] = useState(false);

    useEffect(() => {
      const sentinel = revealSentinelRef.current;
      if (!sentinel) return;
      const observer = new IntersectionObserver(
        ([entry]) => setIdentityVisible(!entry.isIntersecting),
        {
          rootMargin: `-${HEADER_LAYOUT.HEIGHT_PX + T.REVEAL_OFFSET_PX}px 0px 0px 0px`,
        },
      );
      observer.observe(sentinel);
      return () => observer.disconnect();
    }, []);

    return (
      <div>
        <div ref={revealSentinelRef} />
        {/* The list pages' toolbar row (ListToolbar), so the actions sit exactly where theirs do. */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: LIST_PAGE.TOOLBAR_Z_INDEX,
            background: DEFAULT_COLORS.PAGE_BG,
            padding: LIST_PAGE.TOOLBAR_PADDING,
            marginTop: LIST_PAGE.SUBHEADER_TOOLBAR_OFFSET_PX,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.MD,
              minHeight: LIST_TOOLBAR.ROW_HEIGHT_PX,
            }}
          >
            <AnimatePresence initial={false}>
              {identityVisible ? (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: T.REVEAL_DURATION_S, ease: 'easeOut' }}
                  style={{ minWidth: 0 }}
                >
                  <ApplicationDetailsIdentity application={application} />
                </motion.div>
              ) : null}
            </AnimatePresence>
            {/* Spacer keeps the actions right-aligned whether or not the identity shows. */}
            <span style={{ flex: 1 }} />
            {actions}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: APPLICATION_SECTION_LAYOUT.STACK_GAP_PX,
            // List pages get the gap from their container; here the toolbar shares this block.
            marginTop: LIST_PAGE.CONTENT_GAP_PX + LIST_PAGE.CONTENT_OFFSET_PX,
          }}
        >
          <ApplicationOverviewSection application={application} />
          <ApplicationResourcesSection application={application} />
          <ApplicationWorkloadMetricsSection application={application} />
          <ApplicationChangeLogSection
            application={application}
            rollbackDisabledReason={rollbackDisabledReason}
            onRollbackTo={onRollbackTo}
          />
        </div>
      </div>
    );
  },
);

ApplicationDetailsContent.displayName = 'ApplicationDetailsContent';

export default ApplicationDetailsContent;
