import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { FILTER_PANEL } from '../../../../constants';

interface FilterPanelHeaderProps {
  onClose: () => void;
  title?: string;
}

const FilterPanelHeader: React.FC<FilterPanelHeaderProps> = ({ onClose, title = 'Filter' }) => {
  return (
    <div style={FILTER_PANEL.HEADER}>
      <h2 style={FILTER_PANEL.TITLE}>{title}</h2>
      <button
        type="button"
        onClick={onClose}
        style={FILTER_PANEL.CLOSE_BUTTON}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#0B1F33';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#64748b';
        }}
      >
        <CloseOutlined />
      </button>
    </div>
  );
};

export default FilterPanelHeader;
