import React, { memo } from 'react';
import SettingsCard from '../../../../settings/components/SettingsCard';
import MutedText from './MutedText';
import ApplicationWorkloadMetrics from './ApplicationWorkloadMetrics';
import { APPLICATIONS_UI } from '../../constants';
import type { Application } from '../../models';

const ApplicationWorkloadMetricsSection: React.FC<{ application: Application }> = memo(
  ({ application }) => {
    const workloads = application.metrics?.workloads;
    return (
      <SettingsCard
        collapsible
        title={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.TITLE}
        description={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.DESCRIPTION}
      >
        {!workloads?.length ? (
          <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
        ) : (
          <ApplicationWorkloadMetrics workloads={workloads} />
        )}
      </SettingsCard>
    );
  },
);

ApplicationWorkloadMetricsSection.displayName = 'ApplicationWorkloadMetricsSection';

export default ApplicationWorkloadMetricsSection;
