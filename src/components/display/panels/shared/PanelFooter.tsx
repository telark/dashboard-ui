import React from 'react';
import { BUTTON_TEXTS, PANEL_FOOTER } from '../../../../constants';
import type { PanelFooterProps } from '../../../../interfaces/layout/panels';
import { ActionButtons } from '../../buttons';

// ActionButtons supplies the Cancel label and the disabled and loading defaults.
const PanelFooter: React.FC<PanelFooterProps> = ({
  onCancel,
  onPrimary,
  cancelLabel,
  primaryLabel = BUTTON_TEXTS.SUBMIT,
  primaryDisabled,
  primaryLoading,
}) => (
  <div style={PANEL_FOOTER.BAR}>
    <ActionButtons
      confirmText={primaryLabel}
      onConfirm={onPrimary}
      onCancel={onCancel}
      cancelText={cancelLabel}
      loading={primaryLoading}
      confirmDisabled={primaryDisabled}
    />
  </div>
);

export default PanelFooter;
