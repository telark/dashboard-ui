import React, { memo, useEffect, useRef, useState } from 'react';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../../constants';
import type { Application } from '../../models';
import {
  APPLICATION_DETAILS_TOOLBAR,
  APPLICATION_SECTION_LAYOUT,
} from '../../constants/sectionLayout';
import ApplicationDetailsToolbar from '../../components/layout/ApplicationDetailsToolbar';
import ApplicationDetailsIdentity from '../../components/layout/ApplicationDetailsIdentity';
import ApplicationOverviewSection from '../../components/details/ApplicationOverviewSection';
import ApplicationResourcesSection from '../../components/details/ApplicationResourcesSection';
import ApplicationMetricsSection from '../../components/details/ApplicationMetricsSection';
import ApplicationWorkloadMetricsSection from '../../components/details/ApplicationWorkloadMetricsSection';
import ApplicationChangeLogSection from '../../components/details/ApplicationChangeLogSection';

interface ApplicationDetailsContentProps {
  application: Application;
  syncDisabled?: boolean;
  onForceSync: () => void;
  onEdit: () => void;
  onManageSnapshots: () => void;
  onManageRollbacks: () => void;
  onOpenInsights?: () => void;
  onReset: () => void;
}

// Thin orchestrator: each section owns its own data and rendering. This keeps the
// details page a readable list of sections rather than a single monolith.
const ApplicationDetailsContent: React.FC<ApplicationDetailsContentProps> = memo(
  ({
    application,
    syncDisabled = false,
    onForceSync,
    onEdit,
    onManageSnapshots,
    onManageRollbacks,
    onOpenInsights,
    onReset,
  }) => {
    // The identity strip only earns its space once the page header is gone. A
    // sentinel + observer works whichever ancestor owns the scroll.
    const revealSentinelRef = useRef<HTMLDivElement>(null);
    const [identityVisible, setIdentityVisible] = useState(false);

    useEffect(() => {
      const sentinel = revealSentinelRef.current;
      if (!sentinel) return;
      const observer = new IntersectionObserver(
        ([entry]) => setIdentityVisible(!entry.isIntersecting),
        {
          rootMargin: `-${HEADER_LAYOUT.HEIGHT_PX + APPLICATION_DETAILS_TOOLBAR.REVEAL_OFFSET_PX}px 0px 0px 0px`,
        },
      );
      observer.observe(sentinel);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: APPLICATION_SECTION_LAYOUT.STACK_GAP_PX,
        }}
      >
        <div ref={revealSentinelRef} />
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            padding: '8px 0',
            background: DEFAULT_COLORS.PAGE_BG,
          }}
        >
          <ApplicationDetailsIdentity application={application} visible={identityVisible} />
          {/* Spacer keeps the actions right-aligned whether or not the identity shows. */}
          <span style={{ flex: 1 }} />
          <ApplicationDetailsToolbar
            onForceSync={onForceSync}
            syncDisabled={syncDisabled}
            onEdit={onEdit}
            onManageSnapshots={onManageSnapshots}
            onManageRollbacks={onManageRollbacks}
            onOpenInsights={onOpenInsights}
            onReset={onReset}
          />
        </div>

        <ApplicationOverviewSection application={application} />
        <ApplicationResourcesSection application={application} />
        <ApplicationMetricsSection application={application} />
        <ApplicationWorkloadMetricsSection application={application} />
        <ApplicationChangeLogSection application={application} />
      </div>
    );
  },
);

ApplicationDetailsContent.displayName = 'ApplicationDetailsContent';

export default ApplicationDetailsContent;
