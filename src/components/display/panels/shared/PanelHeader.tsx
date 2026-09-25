import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { SLIDE_OUT } from '../../../../constants';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {extra}
          <button
            type="button"
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
