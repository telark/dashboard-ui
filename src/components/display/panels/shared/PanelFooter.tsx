import React from 'react';
import { BUTTON_TEXTS, PANEL_FOOTER } from '../../../../constants';
import type { PanelFooterProps } from '../../../../interfaces/layout/panels';
import { ActionButtons } from '../../buttons';

const PanelFooter: React.FC<PanelFooterProps> = ({
  onCancel,
  onPrimary,
  cancelLabel = BUTTON_TEXTS.CANCEL,
  primaryLabel = BUTTON_TEXTS.SUBMIT,
  primaryDisabled = false,
  primaryLoading = false,
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
