import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { SLIDE_OUT } from '../../../../constants';

interface PanelHeaderProps {
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ title = 'Panel', subtitle, onClose }) => {
  return (
    <div style={SLIDE_OUT.HEADER}>
      <div style={SLIDE_OUT.HEADER_CONTENT}>
        <div style={SLIDE_OUT.TITLE_CONTAINER}>
          <h2 style={SLIDE_OUT.TITLE}>{title}</h2>
          {subtitle && (
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: 14,
                color: '#64748b',
                fontWeight: 400,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
