import React from 'react';
import { Metric } from '../../shared';
import { GROUPER_CARD_STYLES } from '../../../constants/cards/grouper';
import { UI } from '../../../constants/ui';

interface GrouperCardMetricsProps {
  numberOfWorkloads: number;
  numberOfBridges: number;
}

const GrouperCardMetrics: React.FC<GrouperCardMetricsProps> = React.memo(({ 
  numberOfWorkloads, 
  numberOfBridges 
}) => {
  return (
    <div style={GROUPER_CARD_STYLES.metricsContainer}>
      <Metric label={UI.CARD.METRICS.WORKLOADS} value={numberOfWorkloads} />
      <Metric label={UI.CARD.METRICS.BRIDGES} value={numberOfBridges} />
    </div>
  );
});

GrouperCardMetrics.displayName = 'GrouperCardMetrics';

export default GrouperCardMetrics;
