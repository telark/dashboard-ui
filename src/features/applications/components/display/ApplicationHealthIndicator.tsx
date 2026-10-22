import React from 'react';
import { DEFAULT_COLORS, STATUS_COLORS } from '../../../../constants';
import { HealthIndicator } from '../../../../components/display/details';
import { APPLICATION_CARD, APPLICATIONS_UI } from '../../constants';

// The app's health words and loud states on the shared indicator.
const ApplicationHealthIndicator: React.FC<{ status?: string }> = ({ status }) => {
  const key = (status || APPLICATIONS_UI.FALLBACKS.UNKNOWN).toLowerCase();
  return (
    <HealthIndicator
      label={APPLICATION_CARD.HEALTH_LABELS[key] ?? status}
      accent={STATUS_COLORS.APPLICATION_HEALTH[key] ?? DEFAULT_COLORS.NEUTRAL}
      loud={APPLICATION_CARD.LOUD_HEALTH.includes(key)}
    />
  );
};

export default ApplicationHealthIndicator;
