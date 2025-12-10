import React from 'react';
import { SLIDE_OUT } from '../../../constants';
import { PrimaryButton } from '../buttons';

interface PanelFooterProps {
  onCancel?: () => void;
  onPrimary?: () => void;
  cancelLabel?: string;
  primaryLabel?: string;
}

const PanelFooter: React.FC<PanelFooterProps> = ({
  onCancel,
  onPrimary,
  cancelLabel = 'Cancel',
  primaryLabel = 'Submit',
}) => {
  const footerStyle: React.CSSProperties = {
    ...SLIDE_OUT.FOOTER,
    padding: '16px 24px',
    marginTop: 'auto',
  };

  return (
    <div style={footerStyle}>
      <button
        type="button"
        onClick={onCancel}
        style={SLIDE_OUT.CANCEL_BUTTON}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_HOVER_BACKGROUND;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_DEFAULT_BACKGROUND;
        }}
      >
        {cancelLabel}
      </button>
      <PrimaryButton
        action={primaryLabel}
        onClick={onPrimary || (() => {})}
        loading={false}
        loadingLabel={primaryLabel}
        icon={undefined}
        disabled={!onPrimary}
      />
    </div>
  );
};

export default PanelFooter;
