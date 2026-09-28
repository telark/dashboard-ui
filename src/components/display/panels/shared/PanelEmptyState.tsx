import React, { memo } from 'react';
import { PANEL_EMPTY_STATE } from '../../../../constants';

interface PanelEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const PanelEmptyState: React.FC<PanelEmptyStateProps> = memo(
  ({ icon, title, description, action }) => (
    <div style={PANEL_EMPTY_STATE.CONTAINER}>
      {icon ? <span style={PANEL_EMPTY_STATE.ICON}>{icon}</span> : null}
      <div style={PANEL_EMPTY_STATE.TITLE}>{title}</div>
      <div style={PANEL_EMPTY_STATE.DESCRIPTION}>{description}</div>
      {action ? <div style={PANEL_EMPTY_STATE.ACTION}>{action}</div> : null}
    </div>
  ),
);

PanelEmptyState.displayName = 'PanelEmptyState';

export default PanelEmptyState;
