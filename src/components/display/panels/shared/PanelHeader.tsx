import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { BUTTON_TEXTS, SLIDE_OUT, SPACING } from '../../../../constants';

interface PanelHeaderProps {
  title?: string;
  onClose: () => void;
  extra?: React.ReactNode;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ title = 'Panel', extra, onClose }) => {
  return (
    <div style={SLIDE_OUT.HEADER}>
      <div style={SLIDE_OUT.HEADER_CONTENT}>
        <div style={SLIDE_OUT.TITLE_CONTAINER}>
          <h2 style={SLIDE_OUT.TITLE} title={title}>
            {title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.SM }}>
          {extra}
          <button
            type="button"
            aria-label={BUTTON_TEXTS.CLOSE}
            className={SLIDE_OUT.HEADER_BUTTON_CLASS}
            onClick={onClose}
            style={SLIDE_OUT.CLOSE_BUTTON}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = SLIDE_OUT.CLOSE_BUTTON_HOVER_COLOR;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = SLIDE_OUT.CLOSE_BUTTON_DEFAULT_COLOR;
            }}
          >
            <CloseOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelHeader;
