import React from 'react';
import { BUTTON_TEXTS, SLIDE_OUT } from '../../../../constants';
import type { PanelFooterProps } from '../../../../interfaces/layout/panels';
import { PrimaryButton } from '../../buttons';

const PanelFooter: React.FC<PanelFooterProps> = ({
  onCancel,
  onPrimary,
  cancelLabel = BUTTON_TEXTS.CANCEL,
  primaryLabel = BUTTON_TEXTS.SUBMIT,
  primaryDisabled = false,
  primaryLoading = false,
  primaryIcon,
  primaryLoadingLabel,
}) => (
  <div style={SLIDE_OUT.PINNED_FOOTER}>
    <div style={SLIDE_OUT.FOOTER}>
      <button
        type="button"
        onClick={onCancel}
        style={SLIDE_OUT.CANCEL_BUTTON}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_HOVER_BACKGROUND;
          e.currentTarget.style.color = SLIDE_OUT.CANCEL_BUTTON_HOVER_COLOR;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_DEFAULT_BACKGROUND;
          e.currentTarget.style.color = SLIDE_OUT.CANCEL_BUTTON_DEFAULT_COLOR;
        }}
      >
        {cancelLabel}
      </button>
      <PrimaryButton
        action={primaryLabel}
        onClick={onPrimary || (() => {})}
        loading={primaryLoading}
        loadingLabel={primaryLoadingLabel || primaryLabel}
        icon={primaryIcon}
        disabled={primaryDisabled || !onPrimary}
        style={{ minHeight: 32, height: 32, paddingTop: 0, paddingBottom: 0 }}
      />
    </div>
  </div>
);

export default PanelFooter;
