import React from 'react';
import { FILTER_PANEL } from '../../../../constants';

interface FilterPanelFooterProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterPanelFooter: React.FC<FilterPanelFooterProps> = ({ onReset, onApply }) => {
  return (
    <div style={FILTER_PANEL.FOOTER}>
      <button type="button" onClick={onReset} style={FILTER_PANEL.RESET_BUTTON}>
        Reset
      </button>
      <button type="button" onClick={onApply} style={FILTER_PANEL.APPLY_BUTTON}>
        Apply
      </button>
    </div>
  );
};

export default FilterPanelFooter;
