import React from 'react';
import { SLIDE_OUT } from '../../../../constants';
import { PrimaryButton } from '../../buttons';

interface PanelFooterProps {
  onCancel?: () => void;
  onPrimary?: () => void;
  cancelLabel?: string;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  primaryIcon?: React.ReactNode;
  primaryLoadingLabel?: string;
  horizontalPadding?: number;
}

const PanelFooter: React.FC<PanelFooterProps> = ({
  onCancel,
  onPrimary,
  cancelLabel = 'Cancel',
  primaryLabel = 'Submit',
  primaryDisabled = false,
  primaryLoading = false,
  primaryIcon,
  primaryLoadingLabel,
  horizontalPadding = 24,
}) => {
  const footerStyle: React.CSSProperties = {
    ...SLIDE_OUT.FOOTER,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
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
        loading={primaryLoading}
        loadingLabel={primaryLoadingLabel || primaryLabel}
        icon={primaryIcon}
        disabled={primaryDisabled || !onPrimary}
        style={{ minHeight: 32, height: 32, paddingTop: 0, paddingBottom: 0 }}
      />
    </div>
  );
};

export default PanelFooter;
